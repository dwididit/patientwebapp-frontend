import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PatientCreateComponent {

  @ViewChild('messageSection') messageSection!: ElementRef;

  patientForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  genderOptions = ['MALE', 'FEMALE'];
  stateOptions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^04\\d{8}$')]],
      address: ['', [Validators.required]],
      suburb: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postcode: ['', [Validators.required, Validators.pattern('^\\d{4}$')]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.patientForm.valid) {
      this.patientService.createPatient(this.patientForm.value)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
            this.patientForm.reset();
            this.submitted = false;
            this.scrollToMessage();
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'An error occurred while creating the patient';
            this.scrollToMessage();
          }
        });
    }
  }

  private scrollToMessage(): void {
    setTimeout(() => {
      this.messageSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }

  get f() { return this.patientForm.controls; }
}
