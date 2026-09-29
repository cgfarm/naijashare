import JSZip from 'jszip';

export interface CodeFile {
  path: string;
  filename: string;
  language: string;
  category: 'Prisma / Database' | 'API Routes' | 'Frontend Pages' | 'Lib & Auth' | 'Configuration & Docs';
  content: string;
}

export const EXPORTED_FILES: CodeFile[] = [
  {
    path: 'prisma/schema.prisma',
    filename: 'schema.prisma',
    language: 'prisma',
    category: 'Prisma / Database',
    content: `// Naijashare Q-Fix Prisma Schema
// PostgreSQL production database configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CLIENT
  DRIVER
  PROVIDER
  ADMIN
}

enum VerificationStatus {
  UNSUBMITTED
  PENDING
  VERIFIED
  REJECTED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  ESCROW
  PAID
  RELEASED
  REFUNDED
}

model User {
  id                 String              @id @default(uuid())
  name               String
  email              String              @unique
  passwordHash       String
  phone              String              @unique
  role               Role                @default(CLIENT)
  verificationStatus VerificationStatus  @default(UNSUBMITTED)
  ninNumber          String?
  driverLicenseNo    String?
  vehicleModel       String?
  vehiclePlate       String?
  businessName       String?
  serviceCategory    String?
  city               String              @default("Lagos")
  state              String              @default("Lagos")
  walletBalanceNgn   Decimal             @default(0.00)
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt

  // Relationships
  ridesDriven        Ride[]              @relation("DriverRides")
  rideBookings       RideBooking[]
  servicesProvided   ServiceItem[]       @relation("ProviderServices")
  serviceBookings    ServiceBooking[]
  apartmentsHosted   Apartment[]         @relation("HostApartments")
  apartmentBookings  ApartmentBooking[]
  verifications      VerificationDoc[]
  complaints         Complaint[]
  reviews            Review[]
}

model Ride {
  id             String        @id @default(uuid())
  driverId       String
  driver         User          @relation("DriverRides", fields: [driverId], references: [id])
  origin         String
  destination    String
  city           String
  departureTime  DateTime
  availableSeats Int
  totalSeats     Int
  pricePerSeat   Decimal
  amenities      String[]
  status         String        @default("ACTIVE") // ACTIVE, FULL, COMPLETED
  createdAt      DateTime      @default(now())

  bookings       RideBooking[]
}

model RideBooking {
  id             String        @id @default(uuid())
  rideId         String
  ride           Ride          @relation(fields: [rideId], references: [id])
  clientId       String
  client         User          @relation(fields: [clientId], references: [id])
  seatsBooked    Int           @default(1)
  totalAmount    Decimal
  paymentStatus  PaymentStatus @default(PAID)
  bookingStatus  BookingStatus @default(CONFIRMED)
  pickupAddress  String
  dropoffAddress String
  paymentRef     String        @unique
  createdAt      DateTime      @default(now())
}

model ServiceItem {
  id               String           @id @default(uuid())
  providerId       String
  provider         User             @relation("ProviderServices", fields: [providerId], references: [id])
  category         String           // Electrical, Plumbing, AC, Generator
  title            String
  description      String
  basePrice        Decimal
  hourlyRate       Decimal?
  city             String
  area             String
  isAvailableToday Boolean          @default(true)
  createdAt        DateTime         @default(now())

  bookings         ServiceBooking[]
}

model ServiceBooking {
  id               String        @id @default(uuid())
  serviceId        String
  service          ServiceItem   @relation(fields: [serviceId], references: [id])
  clientId         String
  client           User          @relation(fields: [clientId], references: [id])
  scheduledDate    DateTime
  clientAddress    String
  issueDescription String
  quotedAmount     Decimal
  paymentStatus    PaymentStatus @default(ESCROW)
  bookingStatus    BookingStatus @default(PENDING)
  paymentRef       String        @unique
  createdAt        DateTime      @default(now())
}

model Apartment {
  id            String             @id @default(uuid())
  hostId        String
  host          User               @relation("HostApartments", fields: [hostId], references: [id])
  title         String
  apartmentType String             // Studio, 1-Bedroom, 2-Bedroom, Penthouse
  location      String
  city          String
  state         String
  pricePerNight Decimal
  bedrooms      Int
  bathrooms     Int
  maxGuests     Int
  amenities     String[]
  available     Boolean            @default(true)
  createdAt     DateTime           @default(now())

  bookings      ApartmentBooking[]
}

model ApartmentBooking {
  id            String        @id @default(uuid())
  apartmentId   String
  apartment     Apartment     @relation(fields: [apartmentId], references: [id])
  clientId      String
  client        User          @relation(fields: [clientId], references: [id])
  checkInDate   DateTime
  checkOutDate  DateTime
  nights        Int
  totalAmount   Decimal
  paymentStatus PaymentStatus @default(PAID)
  bookingStatus BookingStatus @default(CONFIRMED)
  paymentRef    String        @unique
  createdAt     DateTime      @default(now())
}

model VerificationDoc {
  id             String             @id @default(uuid())
  userId         String
  user           User               @relation(fields: [userId], references: [id])
  documentType   String             // NIN, DRIVER_LICENSE, CAC_CERTIFICATE
  documentNumber String
  fileUrl        String
  status         VerificationStatus @default(PENDING)
  submittedAt    DateTime           @default(now())
  reviewedAt     DateTime?
  notes          String?
}

model Complaint {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  ticketNo    String   @unique
  subject     String
  category    String
  description String
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
}

model Review {
  id         String   @id @default(uuid())
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  targetType String   // DRIVER, PROVIDER, APARTMENT
  targetId   String
  rating     Int      // 1 to 5
  comment    String
  createdAt  DateTime @default(now())
}
`
  },
  {
    path: 'prisma/seed.ts',
    filename: 'seed.ts',
    language: 'typescript',
    category: 'Prisma / Database',
    content: `import { PrismaClient, Role, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Naijashare Q-Fix demo database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Demonstration Accounts
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@naijashare.com' },
    update: {},
    create: {
      name: 'Chidi Okonkwo',
      email: 'client@naijashare.com',
      passwordHash,
      phone: '+2348034567890',
      role: Role.CLIENT,
      verificationStatus: VerificationStatus.VERIFIED,
      city: 'Lekki',
      state: 'Lagos',
      walletBalanceNgn: 45000,
    },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@naijashare.com' },
    update: {},
    create: {
      name: 'Babatunde Adeleke',
      email: 'driver@naijashare.com',
      passwordHash,
      phone: '+2348123456789',
      role: Role.DRIVER,
      verificationStatus: VerificationStatus.VERIFIED,
      vehicleModel: 'Toyota Corolla 2021',
      vehiclePlate: 'KJA-482-DE',
      driverLicenseNo: 'LAG-3849204-B',
      city: 'Ikeja',
      state: 'Lagos',
      walletBalanceNgn: 128500,
    },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@naijashare.com' },
    update: {},
    create: {
      name: 'Engr. Emeka Nwosu',
      email: 'provider@naijashare.com',
      passwordHash,
      phone: '+2348067891234',
      role: Role.PROVIDER,
      verificationStatus: VerificationStatus.VERIFIED,
      businessName: 'Apex Solar & Electric Works',
      serviceCategory: 'Electrical & Solar',
      city: 'Victoria Island',
      state: 'Lagos',
      walletBalanceNgn: 215000,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naijashare.com' },
    update: {},
    create: {
      name: 'Amina Bello',
      email: 'admin@naijashare.com',
      passwordHash,
      phone: '+2349091112233',
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      city: 'Central Business District',
      state: 'Abuja',
      walletBalanceNgn: 850000,
    },
  });

  // 2. Seed Sample Rides
  await prisma.ride.create({
    data: {
      driverId: driverUser.id,
      origin: 'Admiralty Way, Lekki Phase 1',
      destination: 'Murtala Muhammed Airport (MMA2), Ikeja',
      city: 'Lagos',
      departureTime: new Date(Date.now() + 3600000 * 4),
      availableSeats: 3,
      totalSeats: 4,
      pricePerSeat: 4500,
      amenities: ['Full Air Condition', 'Luggage Space', 'Fast Toll Pass'],
      status: 'ACTIVE',
    },
  });

  // 3. Seed Q-Fix Handyman Service
  await prisma.serviceItem.create({
    data: {
      providerId: providerUser.id,
      category: 'Electrical & Solar',
      title: 'Inverter, Lithium Battery & Solar Diagnostic',
      description: 'Troubleshooting inverters, charge controllers, and battery banks for continuous 24/7 power.',
      basePrice: 15000,
      hourlyRate: 5000,
      city: 'Lagos',
      area: 'Lekki / Victoria Island',
      isAvailableToday: true,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`
  },
  {
    path: 'src/lib/auth.ts',
    filename: 'auth.ts',
    language: 'typescript',
    category: 'Lib & Auth',
    content: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'naijashare-super-secure-secret-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
`
  },
  {
    path: 'src/lib/prisma.ts',
    filename: 'prisma.ts',
    language: 'typescript',
    category: 'Lib & Auth',
    content: `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`
  },
  {
    path: 'src/lib/validation.ts',
    filename: 'validation.ts',
    language: 'typescript',
    category: 'Lib & Auth',
    content: `export function isValidEmail(email: string): boolean {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
}

export function isValidNigerianPhone(phone: string): boolean {
  // Accepts +234XXXXXXXXXX or 080XXXXXXXX, 090, 070, 081
  const cleaned = phone.replace(/[\\s-]/g, '');
  return /^(\\+234|0)[789][01]\\d{8}$/.test(cleaned);
}

export function isValidNIN(nin: string): boolean {
  return /^\\d{11}$/.test(nin.trim());
}
`
  },
  {
    path: 'src/app/api/auth/login/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'API Routes',
    content: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        city: user.city,
        state: user.state,
        walletBalanceNgn: user.walletBalanceNgn,
      },
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('naijashare_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`
  },
  {
    path: 'src/app/api/auth/register/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'API Routes',
    content: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { isValidEmail, isValidNigerianPhone } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, city, state, ninNumber, driverLicenseNo, vehicleModel, vehiclePlate } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userRole = role || 'CLIENT';
    const isClient = userRole === 'CLIENT';

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone,
        role: userRole,
        verificationStatus: isClient ? 'VERIFIED' : 'PENDING',
        city: city || 'Lagos',
        state: state || 'Lagos',
        ninNumber,
        driverLicenseNo,
        vehicleModel,
        vehiclePlate,
        walletBalanceNgn: 10000.00,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        verificationStatus: newUser.verificationStatus,
      },
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`
  },
  {
    path: 'src/app/api/rides/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'API Routes',
    content: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    const rides = await prisma.ride.findMany({
      where: {
        status: 'ACTIVE',
        availableSeats: { gt: 0 },
        ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
      },
      include: {
        driver: {
          select: {
            name: true,
            verificationStatus: true,
            vehicleModel: true,
            vehiclePlate: true,
          },
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    return NextResponse.json({ rides });
  } catch (error) {
    console.error('Failed to fetch rides:', error);
    return NextResponse.json({ error: 'Failed to fetch rides' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.split(' ')[1]);
    if (!payload || (payload.role !== 'DRIVER' && payload.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only verified drivers can post rides' }, { status: 403 });
    }

    const body = await req.json();
    const { origin, destination, city, departureTime, totalSeats, pricePerSeat, amenities } = body;

    const ride = await prisma.ride.create({
      data: {
        driverId: payload.userId,
        origin,
        destination,
        city: city || 'Lagos',
        departureTime: new Date(departureTime),
        availableSeats: totalSeats,
        totalSeats,
        pricePerSeat,
        amenities: amenities || ['Air Condition'],
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, ride }, { status: 201 });
  } catch (error) {
    console.error('Failed to create ride:', error);
    return NextResponse.json({ error: 'Failed to create ride' }, { status: 500 });
  }
}
`
  },
  {
    path: 'src/app/api/bookings/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'API Routes',
    content: `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.split(' ')[1]);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { type, rideId, seatsBooked, pickupAddress, dropoffAddress, serviceId, scheduledDate, issueDescription } = body;

    if (type === 'RIDE') {
      const ride = await prisma.ride.findUnique({ where: { id: rideId } });
      if (!ride || ride.availableSeats < seatsBooked) {
        return NextResponse.json({ error: 'Insufficient seats available' }, { status: 400 });
      }

      const totalAmount = Number(ride.pricePerSeat) * seatsBooked;
      const paymentRef = \`NSQ-PAY-\${Math.floor(100000 + Math.random() * 900000)}\`;

      const [booking] = await prisma.$transaction([
        prisma.rideBooking.create({
          data: {
            rideId,
            clientId: payload.userId,
            seatsBooked,
            totalAmount,
            pickupAddress,
            dropoffAddress,
            paymentRef,
            paymentStatus: 'PAID',
            bookingStatus: 'CONFIRMED',
          },
        }),
        prisma.ride.update({
          where: { id: rideId },
          data: {
            availableSeats: { decrement: seatsBooked },
          },
        }),
      ]);

      return NextResponse.json({ success: true, booking });
    }

    return NextResponse.json({ error: 'Unsupported booking type' }, { status: 400 });
  } catch (error) {
    console.error('Booking failed:', error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
`
  },
  {
    path: 'src/app/api/webhooks/paystack/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'API Routes',
    content: `import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_secret_key';
    const signature = req.headers.get('x-paystack-signature');
    const rawBody = await req.text();

    // 1. Verify HMAC SHA512 Cryptographic Signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // 2. Process Charge Success Event
    if (event.event === 'charge.success') {
      const { reference, amount, customer, metadata } = event.data;

      // Update RideBooking or ServiceBooking escrow state
      await prisma.$transaction([
        prisma.rideBooking.updateMany({
          where: { paymentRef: reference },
          data: { paymentStatus: 'PAID', bookingStatus: 'CONFIRMED' }
        }),
        prisma.serviceBooking.updateMany({
          where: { paymentRef: reference },
          data: { paymentStatus: 'ESCROW', bookingStatus: 'ACCEPTED' }
        }),
        prisma.apartmentBooking.updateMany({
          where: { paymentRef: reference },
          data: { paymentStatus: 'PAID', bookingStatus: 'CONFIRMED' }
        })
      ]);

      console.log(\`[Paystack Webhook Verified] Payment \${reference} for \${customer.email} processed.\`);
    }

    // 3. Process Refund Event
    if (event.event === 'refund.processed') {
      const { transaction_reference } = event.data;
      await prisma.rideBooking.updateMany({
        where: { paymentRef: transaction_reference },
        data: { paymentStatus: 'REFUNDED', bookingStatus: 'CANCELLED' }
      });
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
`
  },
  {
    path: '.env.example',
    filename: '.env.example',
    language: 'bash',
    category: 'Configuration & Docs',
    content: `# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/naijashare?schema=public"

# Authentication
JWT_SECRET="naijashare-super-secret-jwt-key-min-32-characters"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payments (Paystack & Flutterwave Integration)
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Identity Verification
NIN_VERIFICATION_API_KEY="nimc_partner_key_here"
`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    category: 'Configuration & Docs',
    content: `# Naijashare Q-Fix Full-Stack Starter Platform

Naijashare Q-Fix is an all-in-one Nigerian ecosystem bringing together:
1. **Rideshare & Carpool**: Punctual inter-city & intra-city commutes across Lagos, Abuja, Ibadan, and Port Harcourt.
2. **Q-Fix Handyman Marketplace**: Verified artisans and certified technicians (Solar, HVAC, Electrical, Plumbing, Generator maintenance) with escrow payment protection.
3. **Apartment Shortlets**: Verified serviced flats with 24/7 power, security, and Starlink internet.
4. **Unified Verification Engine**: Role-based access for Clients, Drivers, Providers, and Admins with NIN and license vetting.

## Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: JWT Sessions with bcrypt password hashing
- **Payments**: Paystack & Flutterwave NGN escrow support

## Setup Instructions

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Configure Environment**
\`\`\`bash
cp .env.example .env
\`\`\`
Edit \`.env\` with your PostgreSQL connection string.

3. **Push Schema & Seed Database**
\`\`\`bash
npx prisma db push
npx prisma db seed
\`\`\`

4. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts
- **Client**: \`client@naijashare.com\` / \`password123\`
- **Driver**: \`driver@naijashare.com\` / \`password123\`
- **Provider**: \`provider@naijashare.com\` / \`password123\`
- **Admin**: \`admin@naijashare.com\` / \`password123\`
`
  }
];

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder('naijashare-qfix');

  for (const file of EXPORTED_FILES) {
    root?.file(file.path, file.content);
  }

  // Also include package.json for Next.js starter
  root?.file('package.json', JSON.stringify({
    name: "naijashare-qfix",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "db:push": "prisma db push",
      "db:seed": "tsx prisma/seed.ts",
      "db:studio": "prisma studio"
    },
    dependencies: {
      "@prisma/client": "^5.19.0",
      "bcryptjs": "^2.4.3",
      "jsonwebtoken": "^9.0.2",
      "lucide-react": "^0.441.0",
      "next": "^14.2.10",
      "react": "^18.3.1",
      "react-dom": "^18.3.1"
    },
    devDependencies: {
      "@types/bcryptjs": "^2.4.6",
      "@types/jsonwebtoken": "^9.0.6",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "prisma": "^5.19.0",
      "tailwindcss": "^3.4.1",
      "tsx": "^4.19.0",
      "typescript": "^5"
    }
  }, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
