import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  @ViewChild('printSection') printSection: any;
  @ViewChild('categoryScroll', { static: false }) categoryScroll!: ElementRef;
  selectedCategory: string = '';
  pizzas = [
    { name: 'Margherita' },
    { name: 'Pepperoni' },
    { name: 'Veggie' },
    { name: 'BBQ Chicken' },
    { name: 'Supreme' },
  ]

  items: any[] = [];
  allItems = [
    { name: 'Grilled Chicken', categoryName: 'Chicken', image: 'assets/chicken1.jpg' },
    { name: 'Spicy Chicken Wings', categoryName: 'Chicken', image: 'assets/chicken2.jpg' },
    { name: 'Spicy Chicken Wings', categoryName: 'Chicken', image: 'assets/chicken2.jpg' },
    { name: 'Spicy Chicken Wings', categoryName: 'Chicken', image: 'assets/chicken2.jpg' },
    { name: 'Spicy Chicken Wings', categoryName: 'Chicken', image: 'assets/chicken2.jpg' },
    { name: 'Spicy Chicken Wings', categoryName: 'Chicken', image: 'assets/chicken2.jpg' },
    { name: 'Pepperoni Pizza', categoryName: 'Pepperoni', image: 'assets/pizza1.jpg' },
    { name: 'Veggie Pizza', categoryName: 'Veggie', image: 'assets/pizza2.jpg' },
    { name: 'Cheese Pizza', categoryName: 'Cheese', image: 'assets/pizza3.jpg' },
    // add more items with categories
  ];


  scrollCategories(direction: 'left' | 'right'): void {
    const container = this.categoryScroll.nativeElement as HTMLElement;

    if (container) {
      const scrollAmount = container.offsetWidth / 2;

      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

        console.log('scrollLeft before:', container.scrollLeft);
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        console.log('scrollLeft after:', container.scrollLeft);

      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }



  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.items = this.allItems.filter(item => item.categoryName === categoryName);

    setTimeout(() => {
      const items = this.categoryScroll.nativeElement.querySelectorAll('.category');
      const selected = Array.from(items).find((el: any) =>
        el.textContent.trim().includes(categoryName)
      ) as HTMLElement;

      selected?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });
  }

  orderItems: any[] = [];

  addToOrder(item: any): void {
    const existingItem = this.orderItems.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.qty += 1;
      existingItem.amount = existingItem.qty * existingItem.price;
    } else {
      this.orderItems.push({
        name: item.name,
        qty: 1,
        price: 30, // Hardcoded as per your template
        amount: 30
      });
    }
  }

  removeItem(item: any): void {
    this.orderItems = this.orderItems.filter(i => i !== item);
  }


  get totalQty(): number {
    return this.orderItems.reduce((sum, item) => sum + item.qty, 0);
  }

  get subTotal(): number {
    return this.orderItems.reduce((sum, item) => sum + item.amount, 0);
  }

  get tax(): number {
    return this.subTotal * 0.05; // 2.5% SGST + 2.5% CGST
  }

  get totalAmount(): number {
    return this.subTotal + this.tax;
  }


  increaseQty(item: any): void {
    item.qty++;
    item.amount = item.qty * item.price;
  }

  decreaseQty(item: any): void {
    if (item.qty > 1) {
      item.qty--;
      item.amount = item.qty * item.price;
    } else {
      // Optionally, remove item if qty reaches 0 or disable decrease button when qty=1
      this.removeItem(item);
    }
  }

  selectedOrderType: string = 'Dine In';

  setOrderType(type: string) {
    this.selectedOrderType = type;
  }

  // printBill() {
  //   window.print();
  // }


  printBill() {
    const printContents = this.printSection.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'width=600,height=800');
    popupWin?.document.open();
    popupWin?.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          .d-flex { display: flex; justify-content: space-between; }
          .small { font-size: 12px; }
        </style>
      </head>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
    </html>
  `);
    popupWin?.document.close();
  }

}
