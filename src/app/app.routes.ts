// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatientCreateComponent } from './components/patient-create/patient-create.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientEditComponent } from './components/patient-edit/patient-edit.component';
import { PatientDeleteComponent } from './components/patient-delete/patient-delete.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-patient', component: PatientCreateComponent },
  { path: 'patient', component: PatientListComponent },
  { path: 'patient/edit', component: PatientEditComponent },
  { path: 'patient/delete', component: PatientDeleteComponent },
  { path: 'patient/search', component: PatientSearchComponent },
  { path: '', redirectTo: '/patient/search', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
