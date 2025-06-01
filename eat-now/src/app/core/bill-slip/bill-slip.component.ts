import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bill-slip',
  templateUrl: './bill-slip.component.html',
  styleUrl: './bill-slip.component.scss'
})
export class BillSlipComponent {
 @Input() orderItems: any[] = [];
  @Input() subTotal: number = 0;
  @Input() totalAmount: number = 0;
  @Input() selectedOrderType: string = 'Dine In';
}
