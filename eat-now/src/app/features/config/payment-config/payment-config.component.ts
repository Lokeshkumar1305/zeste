import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-config',
  templateUrl: './payment-config.component.html',
  styleUrls: ['./payment-config.component.scss']
})
export class PaymentConfigComponent {
  gateways = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      logo: 'https://cdn.razorpay.com/logo.svg',
      connected: true,
      apiKey: 'rzp_test_1234567890',
      secretKey: '••••••••••••••••'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      connected: false,
      apiKey: '',
      secretKey: ''
    }
  ];

  selectedGateway: any = null;

  connect(gateway: any) {
    this.selectedGateway = gateway;
  }

  saveConfig() {
    this.selectedGateway.connected = true;
    this.selectedGateway = null;
  }
}
