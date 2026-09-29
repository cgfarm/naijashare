import { 
  User, 
  UserRole, 
  Ride, 
  ServiceItem, 
  Apartment, 
  RideBooking, 
  ServiceBooking, 
  ApartmentBooking, 
  VerificationRequest, 
  Complaint,
  RefundRequest,
  RatingReview,
  ReceiptData,
  RideSeat,
  SmallBusinessAd
} from '../types';
import {
  OFFICIAL_PLATFORM_DETAILS,
  INITIAL_USERS,
  INITIAL_RIDES,
  INITIAL_SERVICES,
  INITIAL_APARTMENTS,
  INITIAL_RIDE_BOOKINGS,
  INITIAL_SERVICE_BOOKINGS,
  INITIAL_APARTMENT_BOOKINGS,
  INITIAL_REFUNDS,
  INITIAL_REVIEWS,
  INITIAL_VERIFICATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_SMALL_BUSINESSES
} from '../data/mockData';

const DB_KEY = 'naijashare_qfix_db_v4';

interface DatabaseSchema {
  users: User[];
  rides: Ride[];
  services: ServiceItem[];
  apartments: Apartment[];
  rideBookings: RideBooking[];
  serviceBookings: ServiceBooking[];
  apartmentBookings: ApartmentBooking[];
  refundRequests: RefundRequest[];
  reviews: RatingReview[];
  verifications: VerificationRequest[];
  complaints: Complaint[];
  smallBusinesses: SmallBusinessAd[];
  currentUserId: string;
}

function loadDatabase(): DatabaseSchema {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.users && parsed.rides && parsed.services) {
        if (!parsed.smallBusinesses || parsed.smallBusinesses.length === 0) {
          parsed.smallBusinesses = INITIAL_SMALL_BUSINESSES;
        }
        // Ensure admin user has authorized Admin NIN: 14303779142
        const adminUser = parsed.users.find((u: User) => u.role === 'ADMIN' || u.id === 'usr_admin_1');
        if (adminUser) {
          adminUser.ninNumber = '14303779142';
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading from localStorage', e);
  }

  const initialDb: DatabaseSchema = {
    users: INITIAL_USERS,
    rides: INITIAL_RIDES,
    services: INITIAL_SERVICES,
    apartments: INITIAL_APARTMENTS,
    rideBookings: INITIAL_RIDE_BOOKINGS,
    serviceBookings: INITIAL_SERVICE_BOOKINGS,
    apartmentBookings: INITIAL_APARTMENT_BOOKINGS,
    refundRequests: INITIAL_REFUNDS,
    reviews: INITIAL_REVIEWS,
    verifications: INITIAL_VERIFICATIONS,
    complaints: INITIAL_COMPLAINTS,
    smallBusinesses: INITIAL_SMALL_BUSINESSES,
    currentUserId: INITIAL_USERS[0].id,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event('naijashare_db_updated'));
  } catch (e) {
    console.error('Error saving database', e);
  }
}

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = loadDatabase();
  }

  private refresh() {
    this.db = loadDatabase();
  }

  // --- AUTH & USER ---
  getCurrentUser(): User | null {
    this.refresh();
    const user = this.db.users.find(u => u.id === this.db.currentUserId);
    return user || this.db.users[0] || null;
  }

  getAllUsers(): User[] {
    this.refresh();
    return this.db.users;
  }

  switchUserByRole(role: UserRole): User {
    this.refresh();
    const user = this.db.users.find(u => u.role === role);
    if (user) {
      this.db.currentUserId = user.id;
      saveDatabase(this.db);
      return user;
    }
    return this.getCurrentUser()!;
  }

  login(email: string): { success: boolean; user?: User; message?: string } {
    this.refresh();
    const user = this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Invalid credentials. Use demo one-click logins or registered email.' };
    }
    this.db.currentUserId = user.id;
    saveDatabase(this.db);
    return { success: true, user };
  }

  register(userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    city: string;
    state: string;
    ninNumber?: string;
    driverLicenseNo?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
    businessName?: string;
    serviceCategory?: string;
  }): { success: boolean; user: User } {
    this.refresh();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      city: userData.city,
      state: userData.state,
      verificationStatus: userData.role === 'CLIENT' ? 'VERIFIED' : 'PENDING',
      phoneVerified: false,
      emailVerified: false,
      ninVerified: false,
      faceVerified: false,
      walletBalance: 10000,
      ninNumber: userData.ninNumber,
      driverLicenseNo: userData.driverLicenseNo,
      vehicleModel: userData.vehicleModel,
      vehiclePlate: userData.vehiclePlate,
      businessName: userData.businessName,
      serviceCategory: userData.serviceCategory,
      createdAt: new Date().toISOString(),
    };

    this.db.users.push(newUser);
    this.db.currentUserId = newUser.id;

    if (userData.role === 'DRIVER' || userData.role === 'PROVIDER') {
      this.db.verifications.unshift({
        id: `vrf_${Date.now()}`,
        userId: newUser.id,
        userName: newUser.name,
        userRole: newUser.role,
        documentType: userData.role === 'DRIVER' ? 'DRIVER_LICENSE' : 'NIN',
        documentNumber: userData.driverLicenseNo || userData.ninNumber || 'PENDING_UPLOAD',
        proofName: `${newUser.name.replace(/\s+/g, '_')}_Identity_Proof.pdf`,
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
      });
    }

    saveDatabase(this.db);
    return { success: true, user: newUser };
  }

  logout() {
    this.refresh();
    this.db.currentUserId = this.db.users[0]?.id || '';
    saveDatabase(this.db);
  }

  // --- IDENTITY VERIFICATION WORKFLOW ---
  verifyPhoneOTP(otpCode: string): { success: boolean; message: string } {
    this.refresh();
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not found' };
    
    // Simulate OTP validation: 6 digits (e.g. 789456 or any 6-digit entered)
    if (otpCode.length === 6) {
      user.phoneVerified = true;
      saveDatabase(this.db);
      return { success: true, message: `Phone number ${user.phone} successfully verified via SMS OTP.` };
    }
    return { success: false, message: 'Invalid OTP code. Please enter the 6-digit code sent to your phone.' };
  }

  verifyEmail(tokenOrCode: string): { success: boolean; message: string } {
    this.refresh();
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not found' };
    user.emailVerified = true;
    saveDatabase(this.db);
    return { success: true, message: `Email ${user.email} verified successfully!` };
  }

  verifyNINWithThirdParty(nin: string): { success: boolean; data?: any; message: string } {
    this.refresh();
    const cleanNIN = nin.trim();
    if (cleanNIN.length !== 11 || !/^\d+$/.test(cleanNIN)) {
      return { success: false, message: 'NIN must be exactly 11 numeric digits.' };
    }

    const user = this.getCurrentUser();
    if (user) {
      user.ninNumber = cleanNIN;
      user.ninVerified = true;
      
      // Auto register verification request
      this.db.verifications.unshift({
        id: `vrf_nin_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentType: 'NIN',
        documentNumber: cleanNIN,
        proofName: `NIMC_Biometric_Slip_${cleanNIN.slice(-4)}.pdf`,
        faceMatchScore: 97.8,
        ninMatchScore: 100,
        status: 'VERIFIED',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        notes: 'Validated against NIMC National Biometric Identity Database via Seamfix/Q-Fix Gateway.'
      });

      saveDatabase(this.db);
    }

    return {
      success: true,
      data: {
        nin: cleanNIN,
        status: 'ACTIVE_NIMC',
        issuanceAgency: 'National Identity Management Commission (NIMC)',
        trackingId: `NIMC-${Math.floor(100000000 + Math.random() * 900000000)}`
      },
      message: 'NIN record successfully matched with NIMC central registry.'
    };
  }

  verifyLivenessFace(selfieDataUrl?: string): { success: boolean; matchScore: number; message: string } {
    this.refresh();
    const user = this.getCurrentUser();
    if (user) {
      user.faceVerified = true;
      if (user.phoneVerified && user.ninVerified) {
        user.verificationStatus = 'VERIFIED';
      }

      this.db.verifications.unshift({
        id: `vrf_face_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentType: 'LIVENESS_SELFIE',
        documentNumber: `LIVE-${Math.floor(100000 + Math.random() * 900000)}`,
        proofName: 'Liveness_Biometric_3D_Blink_Check.jpg',
        proofDataUrl: selfieDataUrl,
        faceMatchScore: 98.6,
        status: 'VERIFIED',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        notes: 'Passed ISO/IEC 30107-3 anti-spoofing liveness test. Blink and smile confirmed.'
      });

      saveDatabase(this.db);
    }
    return { success: true, matchScore: 98.6, message: 'Liveness verification successful. 3D face structure verified.' };
  }

  verifyVehicleAndDriver(data: {
    licenseNo: string;
    vehicleModel: string;
    vehiclePlate: string;
    roadworthinessNo: string;
  }): { success: boolean; message: string } {
    this.refresh();
    const user = this.getCurrentUser();
    if (user) {
      user.driverLicenseNo = data.licenseNo;
      user.vehicleModel = data.vehicleModel;
      user.vehiclePlate = data.vehiclePlate;
      user.driverVehicleVerified = true;
      user.vehicleInspectionDate = `${new Date().toLocaleDateString()} (Passed FRSC Inspection)`;

      this.db.verifications.unshift({
        id: `vrf_veh_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: 'DRIVER',
        documentType: 'DRIVER_LICENSE',
        documentNumber: data.licenseNo,
        proofName: `FRSC_Vehicle_Plate_${data.vehiclePlate}.pdf`,
        status: 'VERIFIED',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        notes: `FRSC Roadworthiness Certificate (${data.roadworthinessNo}) confirmed authentic.`
      });

      saveDatabase(this.db);
    }
    return { success: true, message: 'Driver license & vehicle documents confirmed valid with FRSC.' };
  }

  // --- RIDES & SEAT AVAILABILITY ---
  getRides(): Ride[] {
    this.refresh();
    return this.db.rides;
  }

  createRide(rideData: Omit<Ride, 'id' | 'driverId' | 'driverName' | 'driverRating' | 'driverVerified'>): Ride {
    this.refresh();
    const currentUser = this.getCurrentUser();
    
    // Generate default seat map
    const seats: RideSeat[] = [
      { seatId: 's1', code: 'F1', label: 'Front Window Co-Pilot', isBooked: false },
      { seatId: 's2', code: 'B1', label: 'Rear Window Left', isBooked: false },
      { seatId: 's3', code: 'B2', label: 'Rear Center', isBooked: false },
      { seatId: 's4', code: 'B3', label: 'Rear Window Right', isBooked: false },
    ].slice(0, rideData.totalSeats);

    const newRide: Ride = {
      id: `ride_${Date.now()}`,
      driverId: currentUser?.id || 'usr_driver_1',
      driverName: currentUser?.name || 'Verified Driver',
      driverPhone: currentUser?.phone || '+234 812 345 6789',
      driverRating: currentUser?.rating || 4.9,
      driverVerified: true,
      vehicleVerified: true,
      seatsMap: seats,
      ...rideData,
    };
    this.db.rides.unshift(newRide);
    saveDatabase(this.db);
    return newRide;
  }

  bookRide(
    rideId: string, 
    seatsCount: number, 
    pickup: string, 
    dropoff: string, 
    selectedSeatCodes?: string[],
    gateway: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT' = 'PAYSTACK'
  ): { success: boolean; booking?: RideBooking; receipt?: ReceiptData; error?: string } {
    this.refresh();
    const ride = this.db.rides.find(r => r.id === rideId);
    if (!ride) return { success: false, error: 'Ride not found' };
    if (ride.availableSeats < seatsCount) return { success: false, error: 'Not enough seats available' };

    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, error: 'Please log in to book' };

    const subtotal = ride.pricePerSeat * seatsCount;
    const escrowFee = Math.round(subtotal * 0.05); // 5% escrow & safety fee
    const vat = Math.round(subtotal * 0.025); // 2.5% VAT
    const totalAmount = subtotal + escrowFee + vat;

    // Reserve specific seats in seatsMap
    if (ride.seatsMap && selectedSeatCodes && selectedSeatCodes.length > 0) {
      ride.seatsMap = ride.seatsMap.map(seat => {
        if (selectedSeatCodes.includes(seat.code)) {
          return { ...seat, isBooked: true, passengerName: currentUser.name };
        }
        return seat;
      });
    }

    ride.availableSeats -= seatsCount;
    if (ride.availableSeats === 0) {
      ride.status = 'FULL';
    }

    const paymentRef = gateway === 'PAYSTACK' 
      ? `NSQ-PSTK-${Math.floor(100000 + Math.random() * 900000)}`
      : gateway === 'FLUTTERWAVE'
      ? `NSQ-FLW-${Math.floor(100000 + Math.random() * 900000)}`
      : `NSQ-MNP-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking: RideBooking = {
      id: `rbk_${Date.now()}`,
      rideId: ride.id,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      seatsBooked: seatsCount,
      selectedSeats: selectedSeatCodes || ['Assigned upon boarding'],
      totalAmount,
      paymentGateway: gateway,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      pickupLocation: pickup || ride.origin,
      dropoffLocation: dropoff || ride.destination,
      rideDate: ride.departureTime,
      paymentRef,
      createdAt: new Date().toISOString()
    };

    this.db.rideBookings.unshift(booking);

    const receipt: ReceiptData = {
      receiptNo: `REC-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('en-NG', { dateStyle: 'long' }),
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      category: 'Carpool & Rideshare',
      itemTitle: `${ride.origin} ➔ ${ride.destination} (${seatsCount} Seat(s))`,
      paymentGateway: gateway === 'PAYSTACK' ? 'Paystack' : gateway === 'FLUTTERWAVE' ? 'Flutterwave' : 'Moniepoint Direct',
      paymentRef,
      subtotal,
      escrowFee,
      vat,
      total: totalAmount,
      status: 'PAID',
      beneficiaryAccount: OFFICIAL_PLATFORM_DETAILS.bankDetails
    };

    saveDatabase(this.db);
    return { success: true, booking, receipt };
  }

  getRideBookings(): RideBooking[] {
    this.refresh();
    return this.db.rideBookings;
  }

  updateRideBookingStatus(bookingId: string, status: RideBooking['bookingStatus']) {
    this.refresh();
    const booking = this.db.rideBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.bookingStatus = status;
      if (status === 'COMPLETED') {
        booking.paymentStatus = 'PAID';
        // Credit driver wallet
        const ride = this.db.rides.find(r => r.id === booking.rideId);
        const driverId = ride?.driverId || 'usr_driver_1';
        const driver = this.db.users.find(u => u.id === driverId);
        if (driver) {
          driver.walletBalance += booking.totalAmount;
        }
      }
      saveDatabase(this.db);
    }
  }

  // --- SERVICES (Q-FIX) ---
  getServices(): ServiceItem[] {
    this.refresh();
    return this.db.services;
  }

  createService(serviceData: Omit<ServiceItem, 'id' | 'providerId' | 'providerName' | 'providerRating' | 'jobsCompleted' | 'isVerified'>): ServiceItem {
    this.refresh();
    const currentUser = this.getCurrentUser();
    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      providerId: currentUser?.id || 'usr_provider_1',
      providerName: currentUser?.name || 'Verified Technician',
      providerRating: 5.0,
      jobsCompleted: 0,
      isVerified: true,
      ...serviceData
    };
    this.db.services.unshift(newService);
    saveDatabase(this.db);
    return newService;
  }

  bookService(data: {
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    issueDescription: string;
    clientAddress: string;
    gateway?: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT';
  }): { success: boolean; booking?: ServiceBooking; receipt?: ReceiptData; error?: string } {
    this.refresh();
    const service = this.db.services.find(s => s.id === data.serviceId);
    if (!service) return { success: false, error: 'Service not found' };

    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, error: 'Please log in' };

    const gateway = data.gateway || 'PAYSTACK';
    const subtotal = service.basePrice;
    const escrowFee = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.025);
    const totalAmount = subtotal + escrowFee + vat;

    const paymentRef = gateway === 'PAYSTACK'
      ? `NSQ-PSTK-ESC-${Math.floor(100000 + Math.random() * 900000)}`
      : gateway === 'FLUTTERWAVE'
      ? `NSQ-FLW-ESC-${Math.floor(100000 + Math.random() * 900000)}`
      : `NSQ-MNP-ESC-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking: ServiceBooking = {
      id: `sbk_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.category,
      providerId: service.providerId,
      providerName: service.providerName,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientAddress: data.clientAddress,
      clientPhone: currentUser.phone,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      issueDescription: data.issueDescription,
      quotedAmount: totalAmount,
      paymentGateway: gateway,
      paymentStatus: 'ESCROW',
      bookingStatus: 'PENDING',
      paymentRef,
      createdAt: new Date().toISOString()
    };

    this.db.serviceBookings.unshift(booking);

    const receipt: ReceiptData = {
      receiptNo: `REC-SRV-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('en-NG', { dateStyle: 'long' }),
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      category: `Q-Fix Handyman (${service.category})`,
      itemTitle: service.title,
      paymentGateway: gateway === 'PAYSTACK' ? 'Paystack' : gateway === 'FLUTTERWAVE' ? 'Flutterwave' : 'Moniepoint Direct',
      paymentRef,
      subtotal,
      escrowFee,
      vat,
      total: totalAmount,
      status: 'ESCROW',
      beneficiaryAccount: OFFICIAL_PLATFORM_DETAILS.bankDetails
    };

    saveDatabase(this.db);
    return { success: true, booking, receipt };
  }

  updateServiceBookingStatus(bookingId: string, status: ServiceBooking['bookingStatus']) {
    this.refresh();
    const booking = this.db.serviceBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.bookingStatus = status;
      if (status === 'COMPLETED') {
        booking.paymentStatus = 'RELEASED';
        // Credit provider wallet
        const provider = this.db.users.find(u => u.id === booking.providerId);
        if (provider) {
          provider.walletBalance += booking.quotedAmount;
        }
      }
      saveDatabase(this.db);
    }
  }

  getServiceBookings(): ServiceBooking[] {
    this.refresh();
    return this.db.serviceBookings;
  }

  // --- APARTMENTS ---
  getApartments(): Apartment[] {
    this.refresh();
    return this.db.apartments;
  }

  bookApartment(data: {
    apartmentId: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestsCount: number;
    gateway?: 'PAYSTACK' | 'FLUTTERWAVE' | 'MONIEPOINT_DIRECT';
  }): { success: boolean; booking?: ApartmentBooking; receipt?: ReceiptData; error?: string } {
    this.refresh();
    const apt = this.db.apartments.find(a => a.id === data.apartmentId);
    if (!apt) return { success: false, error: 'Apartment not found' };

    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, error: 'Please log in' };

    const gateway = data.gateway || 'PAYSTACK';
    const subtotal = apt.pricePerNight * data.nights;
    const escrowFee = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.025);
    const totalAmount = subtotal + escrowFee + vat;

    const paymentRef = gateway === 'PAYSTACK'
      ? `NSQ-PSTK-APT-${Math.floor(100000 + Math.random() * 900000)}`
      : gateway === 'FLUTTERWAVE'
      ? `NSQ-FLW-APT-${Math.floor(100000 + Math.random() * 900000)}`
      : `NSQ-MNP-APT-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking: ApartmentBooking = {
      id: `abk_${Date.now()}`,
      apartmentId: apt.id,
      apartmentTitle: apt.title,
      apartmentLocation: apt.location,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      nights: data.nights,
      guestsCount: data.guestsCount,
      totalAmount,
      paymentGateway: gateway,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      paymentRef,
      createdAt: new Date().toISOString()
    };

    this.db.apartmentBookings.unshift(booking);

    const receipt: ReceiptData = {
      receiptNo: `REC-APT-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('en-NG', { dateStyle: 'long' }),
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      category: 'Serviced Shortlet & Living',
      itemTitle: `${apt.title} (${data.nights} Nights)`,
      paymentGateway: gateway === 'PAYSTACK' ? 'Paystack' : gateway === 'FLUTTERWAVE' ? 'Flutterwave' : 'Moniepoint Direct',
      paymentRef,
      subtotal,
      escrowFee,
      vat,
      total: totalAmount,
      status: 'PAID',
      beneficiaryAccount: OFFICIAL_PLATFORM_DETAILS.bankDetails
    };

    saveDatabase(this.db);
    return { success: true, booking, receipt };
  }

  getApartmentBookings(): ApartmentBooking[] {
    this.refresh();
    return this.db.apartmentBookings;
  }

  // --- CANCELLATIONS & REFUNDS SYSTEM ---
  requestCancellationAndRefund(data: {
    bookingId: string;
    bookingType: 'RIDE' | 'SERVICE' | 'APARTMENT';
    reason: string;
  }): { success: boolean; refund?: RefundRequest; message: string } {
    this.refresh();
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'Please log in' };

    let amount = 0;
    let paymentRef = '';

    if (data.bookingType === 'RIDE') {
      const b = this.db.rideBookings.find(x => x.id === data.bookingId);
      if (b) {
        amount = b.totalAmount;
        paymentRef = b.paymentRef;
        b.bookingStatus = 'CANCELLED';
        b.refundRequested = true;
        b.refundReason = data.reason;
        
        // Re-open seat in ride
        const ride = this.db.rides.find(r => r.id === b.rideId);
        if (ride) {
          ride.availableSeats += b.seatsBooked;
          if (ride.status === 'FULL') ride.status = 'ACTIVE';
        }
      }
    } else if (data.bookingType === 'SERVICE') {
      const b = this.db.serviceBookings.find(x => x.id === data.bookingId);
      if (b) {
        amount = b.quotedAmount;
        paymentRef = b.paymentRef;
        b.bookingStatus = 'CANCELLED';
        b.refundRequested = true;
        b.refundReason = data.reason;
      }
    } else if (data.bookingType === 'APARTMENT') {
      const b = this.db.apartmentBookings.find(x => x.id === data.bookingId);
      if (b) {
        amount = b.totalAmount;
        paymentRef = b.paymentRef;
        b.bookingStatus = 'CANCELLED';
        b.refundRequested = true;
        b.refundReason = data.reason;
      }
    }

    const refund: RefundRequest = {
      id: `ref_${Date.now()}`,
      bookingId: data.bookingId,
      bookingType: data.bookingType,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount,
      reason: data.reason,
      status: 'PENDING',
      paymentRef,
      createdAt: new Date().toISOString()
    };

    this.db.refundRequests.unshift(refund);
    saveDatabase(this.db);
    return {
      success: true,
      refund,
      message: 'Cancellation confirmed. Refund request submitted for automatic processing.'
    };
  }

  processRefund(refundId: string, approve: boolean, adminNote?: string) {
    this.refresh();
    const req = this.db.refundRequests.find(r => r.id === refundId);
    if (!req) return;

    if (approve) {
      req.status = 'PROCESSED';
      req.processedAt = new Date().toISOString();
      req.adminNote = adminNote || 'Refund approved. Escrow funds returned to client account.';

      // Credit client wallet or mark as refunded
      const user = this.db.users.find(u => u.id === req.userId);
      if (user) {
        user.walletBalance += req.amount;
      }

      // Update booking paymentStatus to REFUNDED
      if (req.bookingType === 'RIDE') {
        const b = this.db.rideBookings.find(x => x.id === req.bookingId);
        if (b) b.paymentStatus = 'REFUNDED';
      } else if (req.bookingType === 'SERVICE') {
        const b = this.db.serviceBookings.find(x => x.id === req.bookingId);
        if (b) b.paymentStatus = 'REFUNDED';
      } else if (req.bookingType === 'APARTMENT') {
        const b = this.db.apartmentBookings.find(x => x.id === req.bookingId);
        if (b) b.paymentStatus = 'REFUNDED';
      }
    } else {
      req.status = 'REJECTED';
      req.adminNote = adminNote || 'Refund rejected due to non-refundable cancellation window policy.';
    }

    saveDatabase(this.db);
  }

  getRefundRequests(): RefundRequest[] {
    this.refresh();
    return this.db.refundRequests;
  }

  // --- TWO-WAY RATINGS & REVIEWS ---
  submitReview(review: Omit<RatingReview, 'id' | 'createdAt'>): RatingReview {
    this.refresh();
    const newRev: RatingReview = {
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...review
    };
    this.db.reviews.unshift(newRev);

    // Update target user's aggregated rating
    const targetUser = this.db.users.find(u => u.id === review.toUserId);
    if (targetUser) {
      const userReviews = this.db.reviews.filter(r => r.toUserId === targetUser.id);
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      targetUser.rating = Math.round(avg * 10) / 10;
      targetUser.reviewsCount = userReviews.length;
    }

    saveDatabase(this.db);
    return newRev;
  }

  getReviews(): RatingReview[] {
    this.refresh();
    return this.db.reviews;
  }

  // --- VERIFICATIONS ---
  getVerifications(): VerificationRequest[] {
    this.refresh();
    return this.db.verifications;
  }

  updateVerificationStatus(id: string, status: 'VERIFIED' | 'REJECTED', notes?: string) {
    this.refresh();
    const req = this.db.verifications.find(v => v.id === id);
    if (req) {
      req.status = status;
      req.reviewedAt = new Date().toISOString();
      if (notes) req.notes = notes;

      const user = this.db.users.find(u => u.id === req.userId);
      if (user) {
        if (status === 'VERIFIED') {
          if (req.documentType === 'NIN') user.ninVerified = true;
          if (req.documentType === 'DRIVER_LICENSE') user.driverVehicleVerified = true;
          if (req.documentType === 'LIVENESS_SELFIE') user.faceVerified = true;
          user.verificationStatus = 'VERIFIED';
        } else {
          user.verificationStatus = 'REJECTED';
        }
      }
      saveDatabase(this.db);
    }
  }

  // --- COMPLAINTS ---
  getComplaints(): Complaint[] {
    this.refresh();
    return this.db.complaints;
  }

  submitComplaint(data: { subject: string; category: Complaint['category']; description: string }): Complaint {
    this.refresh();
    const currentUser = this.getCurrentUser();
    const complaint: Complaint = {
      id: `cmp_${Date.now()}`,
      ticketNumber: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id || 'usr_client_1',
      userName: currentUser?.name || 'User',
      userRole: currentUser?.role || 'CLIENT',
      subject: data.subject,
      category: data.category,
      description: data.description,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    this.db.complaints.unshift(complaint);
    saveDatabase(this.db);
    return complaint;
  }

  resolveComplaint(id: string) {
    this.refresh();
    const comp = this.db.complaints.find(c => c.id === id);
    if (comp) {
      comp.status = 'RESOLVED';
      saveDatabase(this.db);
    }
  }

  // --- SMALL BUSINESS ADVERTISING ---
  getSmallBusinesses(): SmallBusinessAd[] {
    this.refresh();
    return this.db.smallBusinesses || INITIAL_SMALL_BUSINESSES;
  }

  submitSmallBusinessAd(ad: Omit<SmallBusinessAd, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'isVerified'>): SmallBusinessAd {
    this.refresh();
    const newAd: SmallBusinessAd = {
      id: `biz_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
      ...ad
    };
    if (!this.db.smallBusinesses) {
      this.db.smallBusinesses = [...INITIAL_SMALL_BUSINESSES];
    }
    this.db.smallBusinesses.unshift(newAd);
    saveDatabase(this.db);
    return newAd;
  }

  deleteSmallBusinessAd(id: string) {
    this.refresh();
    if (this.db.smallBusinesses) {
      this.db.smallBusinesses = this.db.smallBusinesses.filter(b => b.id !== id);
      saveDatabase(this.db);
    }
  }

  // --- STATS ---
  getPlatformStats() {
    this.refresh();
    const totalRideVolume = this.db.rideBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalServiceVolume = this.db.serviceBookings.reduce((sum, b) => sum + b.quotedAmount, 0);
    const totalApartmentVolume = this.db.apartmentBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const grossMerchandiseValue = totalRideVolume + totalServiceVolume + totalApartmentVolume;

    return {
      grossMerchandiseValue,
      totalUsers: this.db.users.length,
      verifiedDrivers: this.db.users.filter(u => u.role === 'DRIVER' && u.verificationStatus === 'VERIFIED').length,
      verifiedProviders: this.db.users.filter(u => u.role === 'PROVIDER' && u.verificationStatus === 'VERIFIED').length,
      activeRidesCount: this.db.rides.filter(r => r.status === 'ACTIVE').length,
      totalBookings: this.db.rideBookings.length + this.db.serviceBookings.length + this.db.apartmentBookings.length,
      pendingVerifications: this.db.verifications.filter(v => v.status === 'PENDING').length,
      pendingRefunds: this.db.refundRequests.filter(r => r.status === 'PENDING').length,
      openComplaints: this.db.complaints.filter(c => c.status === 'OPEN').length
    };
  }

  // --- ADMIN SECURITY & NIN GATE ---
  verifyAdminNIN(nin: string): boolean {
    const clean = nin.trim().replace(/\D/g, '');
    return clean === '14303779142';
  }
}

export const dbService = new DatabaseService();
