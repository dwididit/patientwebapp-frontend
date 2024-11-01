import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

interface PageableResponse {
  statusCode: number;
  message: string;
  data: {
    content: Patient[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    empty: boolean;
  };
  requestId: string;
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  protected Math = Math;
  patients: Patient[] = [];
  loading: boolean = false;
  error: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  private baseUrl = 'http://localhost:9090/api/v1';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    const url = `${this.baseUrl}/patient/page?page=${this.currentPage}&size=${this.pageSize}`;

    this.http.get<PageableResponse>(url).subscribe({
      next: (response) => {
        this.patients = response.data.content;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error loading patients';
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadPatients();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 0; // Reset to first page
    this.loadPatients();
  }

  getVisiblePages(): (number | string)[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | null = null;

    range.push(0); // Always show first page

    for (let i = this.currentPage - delta; i <= this.currentPage + delta; i++) {
      if (i < this.totalPages && i > 0) {
        range.push(i);
      }
    }

    range.push(this.totalPages - 1); // Always show last page

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    for (let i of uniqueRange) {
      if (l !== null) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  editPatient(pid: string): void {
    this.router.navigate(['/patient/edit'], { queryParams: { pid } });
  }

  deletePatient(pid: string): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.router.navigate(['/patient/delete'], { queryParams: { pid } });
    }
  }

  createPatient(): void {
    this.router.navigate(['/create-patient']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
