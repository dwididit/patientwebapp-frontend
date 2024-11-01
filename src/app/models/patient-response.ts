export interface PatientResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    pid: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    phoneNumber: string;
    createdAt: string;
    updateAt: string;
  };
  requestId: string;
}
