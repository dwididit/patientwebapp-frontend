import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { PatientResponse } from '../models/patient-response';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:9090/api/v1/patient';

  constructor(private http: HttpClient) { }

  createPatient(patient: Patient): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(`${this.apiUrl}/create`, patient);
  }

  getPatients(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}/page`, { params });
  }

  searchPatients(params: URLSearchParams): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/search?${params.toString()}`);
  }
}
