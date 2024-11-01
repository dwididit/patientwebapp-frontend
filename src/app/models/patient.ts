export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

