import { Component } from '@angular/core';

interface HeroFeature {
  label: string;
  colorClass: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  navLinks = [
    { label: 'PARTNERS', route: '/auth/login' }, // adjust routes as needed
    { label: 'LOGIN',    route: '/auth/login' }
  ];

  features: HeroFeature[] = [
    { label: 'User Management',     colorClass: 'feature-dot--orange' },
    { label: 'Acquirer support',    colorClass: 'feature-dot--blue' },
    { label: 'Merchant Onboarding', colorClass: 'feature-dot--green' }
  ];
}