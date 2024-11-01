import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Patient {
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
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Patient;
  requestId: string;
}

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit {
  patient: Partial<Patient> = {};
  loading = false;
  error = '';
  success = '';
  private baseUrl = 'http://localhost:9090/api/v1';
  states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
  genders = ['MALE', 'FEMALE', 'OTHER'];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['pid']) {
        this.loadPatient(params['pid']);
      } else {
        this.error = 'No patient ID provided';
      }
    });
  }

  loadPatient(pid: string): void {
    this.loading = true;
    this.http.get<ApiResponse>(`${this.baseUrl}/patient/${pid}`).subscribe({
      next: (response) => {
        this.patient = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error loading patient details';
        this.loading = false;
      }
    });
  }

  updatePatient(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const updateData = {
      firstName: this.patient.firstName,
      lastName: this.patient.lastName,
      dateOfBirth: this.patient.dateOfBirth,
      gender: this.patient.gender,
      phoneNumber: this.patient.phoneNumber,
      address: this.patient.address,
      suburb: this.patient.suburb,
      state: this.patient.state,
      postcode: this.patient.postcode
    };

    this.http.put<ApiResponse>(`${this.baseUrl}/patient/edit?pid=${this.patient.pid}`, updateData)
      .subscribe({
        next: (response) => {
          this.success = 'Patient updated successfully';
          this.loading = false;
          // Navigate back to patient list after short delay
          setTimeout(() => this.router.navigate(['/patient']), 1500);
        },
        error: (error) => {
          this.error = error.error?.message || 'Error updating patient';
          this.loading = false;
        }
      });
  }

  validateForm(): boolean {
    if (!this.patient.firstName || !this.patient.lastName) {
      this.error = 'First name and last name are required';
      return false;
    }
    if (!this.patient.dateOfBirth) {
      this.error = 'Date of birth is required';
      return false;
    }
    if (!this.patient.gender) {
      this.error = 'Gender is required';
      return false;
    }
    if (!this.patient.phoneNumber) {
      this.error = 'Phone number is required';
      return false;
    }
    if (!this.patient.address || !this.patient.suburb || !this.patient.state || !this.patient.postcode) {
      this.error = 'All address fields are required';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/patient']);
  }
}
