import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing/landing-page/landing-page.component';
import { InformationPageComponent } from './features/information/information-page.component';
import { LegalPageComponent } from './features/legal/legal-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'about', component: InformationPageComponent, data: { page: 'about' } },
  { path: 'footballs', component: InformationPageComponent, data: { page: 'footballs' } },
  { path: 'handballs', component: InformationPageComponent, data: { page: 'handballs' } },
  { path: 'technology', component: InformationPageComponent, data: { page: 'technology' } },
  { path: 'privacy-policy', component: LegalPageComponent, data: { page: 'privacy' } },
  { path: 'legal-information', component: LegalPageComponent, data: { page: 'legal' } },
  { path: '**', redirectTo: '' },
];
