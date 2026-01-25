import { Component } from '@angular/core';

@Component({
  selector: 'app-product-config',
  templateUrl: './product-config.component.html',
  styleUrls: ['./product-config.component.scss']
})
export class ProductConfigComponent {
  products = [
    { id: 1, name: 'Standard Room', category: 'Accommodation', price: 1500, active: true },
    { id: 2, name: 'Deluxe Suite', category: 'Accommodation', price: 3500, active: true },
    { id: 3, name: 'Veg Meal', category: 'Food', price: 150, active: true },
    { id: 4, name: 'Laundry Service', category: 'Services', price: 50, active: true }
  ];

  categories = ['Accommodation', 'Food', 'Services', 'Maintenance'];

  newProduct = {
    name: '',
    category: 'Accommodation',
    price: 0
  };

  showAddForm = false;

  addProduct() {
    if (this.newProduct.name) {
      this.products.unshift({
        ...this.newProduct,
        id: Date.now(),
        active: true
      });
      this.newProduct = { name: '', category: 'Accommodation', price: 0 };
      this.showAddForm = false;
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  toggleActive(product: any) {
    product.active = !product.active;
  }
}
