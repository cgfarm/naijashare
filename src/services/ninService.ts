import { NINValidationResult } from '../types';

export interface KnownNINRecord {
  nin: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  phone: string;
  stateOfOrigin: string;
  lga: string;
  residenceAddress: string;
  faceMatchScore: number;
}

export const DEMO_NIN_RECORDS: Record<string, KnownNINRecord> = {
  '92837482910': {
    nin: '92837482910',
    firstName: 'Chidi',
    lastName: 'Stadning',
    middleName: 'Emeka',
    dateOfBirth: '1989-06-14',
    gender: 'M',
    phone: '08086857474',
    stateOfOrigin: 'Anambra',
    lga: 'Onitsha North',
    residenceAddress: 'Block 4, Lagoon View Estate, Admiralty Way, Lekki, Lagos',
    faceMatchScore: 98.6
  },
  '48392019482': {
    nin: '48392019482',
    firstName: 'Babatunde',
    lastName: 'Adeleke',
    middleName: 'Oluwaseun',
    dateOfBirth: '1985-11-22',
    gender: 'M',
    phone: '+234 812 345 6789',
    stateOfOrigin: 'Osun',
    lga: 'Ede South',
    residenceAddress: '12 Allen Avenue, Ikeja, Lagos',
    faceMatchScore: 99.1
  },
  '74829104829': {
    nin: '74829104829',
    firstName: 'Emeka',
    lastName: 'Nwosu',
    middleName: 'Kenneth',
    dateOfBirth: '1982-04-03',
    gender: 'M',
    phone: '+234 806 789 1234',
    stateOfOrigin: 'Enugu',
    lga: 'Nsukka',
    residenceAddress: '8 Karimu Kotun Street, Victoria Island, Lagos',
    faceMatchScore: 97.8
  },
  '52225495180': {
    nin: '52225495180',
    firstName: 'Open House',
    lastName: 'Mission',
    middleName: 'Foundation',
    dateOfBirth: '1995-09-18',
    gender: 'M',
    phone: '08086857474',
    stateOfOrigin: 'Ogun',
    lga: 'Ado-Odo/Ota',
    residenceAddress: 'Ile-Ileri community, Asore Busstop, Ota, Ogun State',
    faceMatchScore: 100.0
  },
  '14303779142': {
    nin: '14303779142',
    firstName: 'Amina',
    lastName: 'Bello',
    middleName: 'Platform Administrator',
    dateOfBirth: '1987-03-12',
    gender: 'F',
    phone: '+234 909 111 2233',
    stateOfOrigin: 'FCT Abuja',
    lga: 'Abuja Municipal',
    residenceAddress: 'Naijashare Operations HQ, Central Business District, Abuja (FCT)',
    faceMatchScore: 99.8
  }
};

/**
 * Service to validate 11-digit NIN numbers against a simulated NIMC / Prembly / VerifyMe third-party identity API endpoint.
 */
class NINApiService {
  private endpointUrl = 'https://api.nimc.gov.ng/v2/citizen/verify';
  private providerName = 'NIMC Central Gateway (Prembly Identity Verified)';

  /**
   * Validates a national identity number against the third-party endpoint.
   */
  async validateNINWithProvider(ninRaw: string): Promise<NINValidationResult> {
    const nin = ninRaw.trim().replace(/\D/g, '');
    const timestamp = new Date().toISOString();

    // 1. Basic formatting validation
    if (!nin) {
      return {
        success: false,
        statusCode: 400,
        message: 'NIN is required. Please provide your 11-digit National Identity Number.',
        provider: this.providerName,
        timestamp
      };
    }

    if (nin.length !== 11) {
      return {
        success: false,
        statusCode: 422,
        message: `Invalid NIN length (${nin.length} digits). A valid Nigerian National Identity Number must be exactly 11 numeric digits.`,
        provider: this.providerName,
        timestamp
      };
    }

    // 2. Simulate API request network latency (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 3. Known / Registered demo records check
    if (DEMO_NIN_RECORDS[nin]) {
      const rec = DEMO_NIN_RECORDS[nin];
      const trackingId = `NIMC-${Math.floor(10000000 + Math.random() * 90000000)}`;
      return {
        success: true,
        statusCode: 200,
        message: 'NIN verified successfully against NIMC National Biometric Register.',
        provider: this.providerName,
        trackingId,
        timestamp,
        data: {
          nin: rec.nin,
          firstName: rec.firstName,
          lastName: rec.lastName,
          middleName: rec.middleName,
          fullName: `${rec.firstName} ${rec.middleName ? rec.middleName + ' ' : ''}${rec.lastName}`,
          dateOfBirth: rec.dateOfBirth,
          gender: rec.gender,
          phone: rec.phone,
          stateOfOrigin: rec.stateOfOrigin,
          lga: rec.lga,
          residenceAddress: rec.residenceAddress,
          faceMatchScore: rec.faceMatchScore,
          nimcSlipUrl: `https://nimc.gov.ng/slips/${trackingId}.pdf`,
          isIdentityActive: true
        }
      };
    }

    // 4. Algorithmically valid fallback for any genuine 11-digit entry
    // Check if starts with 0000 or obviously fake
    if (/^(\d)\1{10}$/.test(nin) || nin === '12345678901' || nin === '00000000000') {
      return {
        success: false,
        statusCode: 404,
        message: 'NIN not found in NIMC biometric database or record is inactive/suspended.',
        provider: this.providerName,
        timestamp
      };
    }

    // Dynamic successful resolution for general valid 11-digit numbers
    const trackingId = `NIMC-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const mockFirstNames = ['Oluwaseun', 'Amina', 'Chinedu', 'Fatima', 'Damilola', 'Ibrahim', 'Kehinde'];
    const mockLastNames = ['Balogun', 'Bello', 'Eze', 'Okonkwo', 'Garba', 'Adeyemi', 'Davies'];
    const mockStates = ['Lagos', 'Ogun', 'Oyo', 'FCT Abuja', 'Rivers', 'Kano', 'Enugu'];
    const hashedIdx = nin.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);

    const fName = mockFirstNames[hashedIdx % mockFirstNames.length];
    const lName = mockLastNames[hashedIdx % mockLastNames.length];
    const state = mockStates[hashedIdx % mockStates.length];

    return {
      success: true,
      statusCode: 200,
      message: 'NIN verified and authenticated with federal NIMC identity records.',
      provider: this.providerName,
      trackingId,
      timestamp,
      data: {
        nin,
        firstName: fName,
        lastName: lName,
        fullName: `${fName} ${lName}`,
        dateOfBirth: `199${(hashedIdx % 9) + 1}-0${(hashedIdx % 8) + 1}-1${(hashedIdx % 9)}`,
        gender: hashedIdx % 2 === 0 ? 'M' : 'F',
        phone: `+234 80${hashedIdx % 10} 000 ${nin.slice(-4)}`,
        stateOfOrigin: state,
        lga: `${state} Central`,
        residenceAddress: `Community District, ${state}, Nigeria`,
        faceMatchScore: 97.4,
        nimcSlipUrl: `https://nimc.gov.ng/slips/${trackingId}.pdf`,
        isIdentityActive: true
      }
    };
  }
}

export const ninApiService = new NINApiService();
