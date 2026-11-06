import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing/landing-page/landing-page.component';
import { InformationPageComponent } from './features/information/information-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  { path: 'about', component: InformationPageComponent, data: { page: 'about' } },
  { path: 'footballs', component: InformationPageComponent, data: { page: 'footballs' } },
  { path: 'handballs', component: InformationPageComponent, data: { page: 'handballs' } },
  { path: 'technology', component: InformationPageComponent, data: { page: 'technology' } },
  {
    path: '**',
    redirectTo: '',
  },
];
