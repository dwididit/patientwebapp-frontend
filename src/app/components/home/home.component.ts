import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToPatientList() {
    this.router.navigate(['/patient']);
  }

  navigateToCreatePatient() {
    this.router.navigate(['/create-patient']);
  }

  navigateToSearchPatient() {
    this.router.navigate(['/patient/search']);
  }
}
