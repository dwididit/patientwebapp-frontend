import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


interface Patient {
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
}

interface SearchResponse {
  statusCode: number;
  message: string;
  data: {
    content: Patient[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    last: boolean;
  };
}

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css']
})
export class PatientSearchComponent implements OnInit {
  searchForm: FormGroup;
  patients: Patient[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
  sortOptions = ['firstName', 'lastName', 'dateOfBirth', 'state'];
  sortDirections = ['ASC', 'DESC'];
  Math = Math;

  constructor(
    private http: HttpClient,  // Changed from patientService to http
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      state: [''],
      startDate: [''],
      endDate: [''],
      sortBy: ['firstName'],
      sortDirection: ['ASC']
    });
  }

  ngOnInit() {
    // Subscribe to form value changes with debounce
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0; // Reset to first page on new search
        this.searchPatients();
      });

    // Initial search
    this.searchPatients();
  }

  searchPatients() {
    this.loading = true;
    const formValues = this.searchForm.value;

    // Build query parameters
    const params = new URLSearchParams({
      page: this.currentPage.toString(),
      size: this.pageSize.toString(),
      sortBy: formValues.sortBy,
      sortDirection: formValues.sortDirection
    });

    // Add optional parameters only if they have values
    if (formValues.name) params.append('name', formValues.name);
    if (formValues.state) params.append('state', formValues.state);
    if (formValues.startDate) params.append('startDate', formValues.startDate);
    if (formValues.endDate) params.append('endDate', formValues.endDate);

    this.http.get<SearchResponse>(`http://localhost:9090/api/v1/patient/search?${params.toString()}`)
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.patients = response.data.content;
            this.totalElements = response.data.totalElements;
            this.totalPages = response.data.totalPages;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching patients:', error);
          this.loading = false;
        }
      });
  }

  getPageNumbers(): number[] {
    const showPages = 2;
    const pages: number[] = [];

    if (this.totalPages <= 5) {
      // If total pages are 5 or less, show all pages
      return Array.from({length: this.totalPages}, (_, i) => i);
    }

    pages.push(0);

    if (this.currentPage > showPages + 1) {
      pages.push(-1);
    }

    const start = Math.max(1, this.currentPage - showPages);
    const end = Math.min(this.totalPages - 2, this.currentPage + showPages);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (this.currentPage < this.totalPages - showPages - 2) {
      pages.push(-1); // Add ellipsis before last page
    }

    if (this.totalPages > 1) {
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  getStartIndex(): number {
    return this.pageSize * this.currentPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.pageSize * (this.currentPage + 1), this.totalElements);
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.searchPatients();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = parseInt(event.target.value);
    this.currentPage = 0;
    this.searchPatients();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  reset() {
    this.searchForm.reset({
      name: '',
      state: '',
      startDate: '',
      endDate: '',
      sortBy: 'firstName',
      sortDirection: 'ASC'
    });
    this.currentPage = 0;
    this.searchPatients();
  }
}
