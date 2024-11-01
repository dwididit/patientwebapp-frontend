import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Patient Web Application</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}"
              >
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/patient"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}"
              >
                View Patients
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/create-patient"
                 routerLinkActive="active"
              >
                Create Patient
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link"
                 routerLink="/patient/search"
                 routerLinkActive="active"
              >
                Search Patient
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }

    .navbar-brand {
      font-weight: 500;
    }

    .nav-link.active {
      font-weight: 500;
      position: relative;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background-color: white;
    }
  `]
})
export class AppComponent {
  title = 'Patient Web Application';
}
