export type UserRole = 'CLIENT' | 'DRIVER' | 'PROVIDER' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNSUBMITTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  rating?: number;
  reviewsCount?: number;
  verificationStatus: VerificationStatus;
  
  // Robust identity flags
  phoneVerified?: boolean;
  emailVerified?: boolean;
  ninVerified?: boolean;
  faceVerified?: boolean;
  driverVehicleVerified?: boolean;
  
  ninNumber?: string;
  driverLicenseNo?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleInspectionDate?: string;
  businessName?: string;
  serviceCategory?: string;
  city: string;
  state: string;
  walletBalance: number;
  createdAt: string;
}

export interface RideSeat {
  seatId: string;
  code: string; // e.g. "F1", "B1", "B2", "B3"
  label: string;
  isBooked: boolean;
  passengerName?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  driverAvatar?: string;
  driverRating: number;
  driverVerified: boolean;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleVerified?: boolean;
  roadworthinessCert?: string;
  origin: string;
  originCoords?: { lat: number; lng: number };
  destination: string;
  destinationCoords?: { lat: number; lng: number };
  city: string;
  departureTime: string;
  estimatedDuration?: string;
  distanceKm?: number;
  availableSeats: number;
  totalSeats: number;
  seatsMap?: RideSeat[];
  pricePerSeat: number; // in NGN
  amenities: string[]; // e.g. "AC", "Luggage Space", "No Smoking"
  status: 'ACTIVE' | 'FULL' | 'COMPLETED' | 'CANCELLED';
  description?: string;
}

export interface RideBooking {
  id: string;
  rideId: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  seatsBooked: number;
  selectedSeats?: string[]; // e.g. ["F1 - Front Window"]
  totalAmount: number;
  paymentGateway?: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickupLocation: string;
  dropoffLocation: string;
  rideDate: string;
  paymentRef: string;
  createdAt: string;
  refundRequested?: boolean;
  refundReason?: string;
}

export type HandymanCategory = 
  | 'Electrical & Solar'
  | 'AC & Refrigeration'
  | 'Plumbing & Drainage'
  | 'Carpentry & Roofing'
  | 'Painting & Renovation'
  | 'Generator Repair';

export interface ServiceItem {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  providerRating: number;
  jobsCompleted: number;
  category: HandymanCategory;
  title: string;
  description: string;
  basePrice: number; // in NGN
  hourlyRate?: number;
  city: string;
  area: string;
  isAvailableToday: boolean;
  isVerified: boolean;
  imageUrl?: string;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: HandymanCategory;
  providerId: string;
  providerName: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientAddress: string;
  clientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  issueDescription: string;
  quotedAmount: number;
  paymentGateway?: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT';
  paymentStatus: 'PAID' | 'ESCROW' | 'RELEASED' | 'REFUNDED';
  bookingStatus: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentRef: string;
  createdAt: string;
  refundRequested?: boolean;
  refundReason?: string;
}

export interface Apartment {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  apartmentType: 'Studio' | '1-Bedroom' | '2-Bedroom' | '3-Bedroom Duplex' | 'Penthouse';
  location: string;
  city: string;
  state: string;
  pricePerNight: number;
  pricePerMonth?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  available: boolean;
  isVerified: boolean;
  description: string;
}

export interface ApartmentBooking {
  id: string;
  apartmentId: string;
  apartmentTitle: string;
  apartmentLocation: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
  totalAmount: number;
  paymentGateway?: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  paymentRef: string;
  createdAt: string;
  refundRequested?: boolean;
  refundReason?: string;
}

export interface RefundRequest {
  id: string;
  bookingId: string;
  bookingType: 'RIDE' | 'SERVICE' | 'APARTMENT';
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  paymentRef: string;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface RatingReview {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  roleTarget: 'DRIVER' | 'PASSENGER' | 'PROVIDER';
  rating: number;
  punctualityScore?: number;
  vehicleOrSkillScore?: number;
  comment: string;
  contextTitle: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  documentType: 'NIN' | 'DRIVER_LICENSE' | 'CAC_CERTIFICATE' | 'UTILITY_BILL' | 'LIVENESS_SELFIE';
  documentNumber: string;
  proofName: string;
  proofDataUrl?: string;
  faceMatchScore?: number;
  ninMatchScore?: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  subject: string;
  category: 'Rideshare' | 'Q-Fix Service' | 'Apartment' | 'Payment / Payout' | 'Other';
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
}

export interface ReceiptData {
  receiptNo: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  category: string;
  itemTitle: string;
  paymentGateway: 'Paystack' | 'Flutterwave' | 'Moniepoint Direct';
  paymentRef: string;
  subtotal: number;
  escrowFee: number;
  vat: number;
  total: number;
  status: 'PAID' | 'ESCROW' | 'REFUNDED';
  beneficiaryAccount?: {
    accountNumber?: string;
    accountNo?: string;
    accountName: string;
    bankName: string;
  };
}

export interface SmallBusinessAd {
  id: string;
  businessName: string;
  tagline: string;
  category: string;
  description: string;
  promoOffer?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  whatsapp?: string;
  website?: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface NINValidationResult {
  success: boolean;
  statusCode: number;
  message: string;
  provider: string;
  trackingId?: string;
  timestamp: string;
  data?: {
    nin: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    stateOfOrigin: string;
    lga: string;
    residenceAddress: string;
    faceMatchScore: number;
    nimcSlipUrl?: string;
    isIdentityActive: boolean;
  };
}
