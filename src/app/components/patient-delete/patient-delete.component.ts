import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container p-4">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header">
              <h2>Delete Patient</h2>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label for="patientId">Patient ID:</label>
                <input
                  type="text"
                  class="form-control"
                  id="patientId"
                  [(ngModel)]="patientId"
                  placeholder="Enter patient ID"
                >
              </div>
              <div class="mt-3">
                <button
                  class="btn btn-danger me-2"
                  (click)="deletePatient()"
                  [disabled]="!patientId"
                >
                  Delete Patient
                </button>
                <button
                  class="btn btn-secondary"
                  (click)="goBack()"
                >
                  Back to List
                </button>
              </div>

              <div *ngIf="message" class="alert mt-3" [ngClass]="{'alert-success': !error, 'alert-danger': error}">
                {{ message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PatientDeleteComponent implements OnInit {
  patientId: string = '';
  message: string = '';
  error: boolean = false;
  private baseUrl = 'http://localhost:9090/api/v1';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get patient ID from query params if available
    const queryParams = new URLSearchParams(window.location.search);
    const pid = queryParams.get('pid');
    if (pid) {
      this.patientId = pid;
    }
  }

  deletePatient(): void {
    if (this.patientId) {
      const url = `${this.baseUrl}/patient/delete?pid=${this.patientId}`;

      this.http.delete(url).subscribe({
        next: (response) => {
          this.message = 'Patient deleted successfully';
          this.error = false;
          this.patientId = '';
          // Navigate back to patient list after short delay
          setTimeout(() => this.goBack(), 1500);
        },
        error: (error) => {
          this.message = error.error?.message || 'Error deleting patient';
          this.error = true;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/patient']);
  }
}
