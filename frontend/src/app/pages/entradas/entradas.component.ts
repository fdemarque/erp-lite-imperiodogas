import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InboundService, Inbound } from '../../services/inbound.service';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../services/product.service';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface Item {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

@Component({
  selector: 'app-entradas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './entradas.component.html',
})
export class EntradasComponent implements OnInit {
  private readonly inboundService = inject(InboundService);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  formatDate = formatDate;
  formatCurrency = formatCurrency;

  search = '';
  isNewFormOpen = signal(false);

  // Lists
  inbounds = signal<Inbound[]>([]);
  filteredInbounds = signal<Inbound[]>([]);
  products = signal<Product[]>([]);

  // Master form
  inboundForm: FormGroup = this.fb.group({
    invoice_number: ['', Validators.required],
    truck_plate: ['', Validators.required],
    preco_custo: [0, [Validators.required, Validators.min(0)]]
  });

  // Detail form (Temporary items)
  pendingItems = signal<Item[]>([]);
  currentItem = { product_id: '', quantity: 1, unit_price: '' as string | number };

  ngOnInit() {
    this.loadInbounds();
    this.loadProducts();
  }

  loadInbounds() {
    this.inboundService.getAll().subscribe((data) => {
      this.inbounds.set(data);
      this.updateFiltered();
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe((data) => {
      if (!data || data.length === 0) {
        console.log('Nenhum produto retornado da API. O banco pode estar vazio.');
      }
      this.products.set(data || []);
    });
  }

  updateFiltered() {
    const s = this.search.toLowerCase();
    this.filteredInbounds.set(this.inbounds().filter((i) =>
      i.invoice_number.toLowerCase().includes(s) ||
      i.truck_plate.toLowerCase().includes(s)
    ));
  }

  handleOpenNew() {
    this.inboundForm.reset({ invoice_number: '', truck_plate: '', preco_custo: 0 });
    this.pendingItems.set([]);
    this.resetCurrentItem();
    this.isNewFormOpen.set(true);
  }

  resetCurrentItem() {
    this.currentItem = { product_id: '', quantity: 1, unit_price: '' };
  }

  addItem() {
    let parsedPrice = 0;
    if (typeof this.currentItem.unit_price === 'string') {
      let clean = this.currentItem.unit_price;
      // Trata a string formatada pelo ngx-mask (ex: 'R$ 222,22' ou '2.222,22')
      clean = clean.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      parsedPrice = parseFloat(clean);
    } else {
      parsedPrice = this.currentItem.unit_price;
    }

    if (!this.currentItem.product_id || this.currentItem.quantity <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) return;

    const prod = this.products().find(p => p.id === this.currentItem.product_id);
    if (!prod) return;

    this.pendingItems.update(items => [
      ...items,
      {
        product_id: this.currentItem.product_id,
        product_name: prod.name,
        quantity: this.currentItem.quantity,
        unit_price: parsedPrice
      }
    ]);

    this.resetCurrentItem();
  }

  removeItem(index: number) {
    this.pendingItems.update(items => items.filter((_, i) => i !== index));
  }

  handleSave() {
    if (this.pendingItems().length === 0) return;

    if (this.inboundForm.invalid) return;

    const formValues = this.inboundForm.value;

    const payload = {
      invoice_number: formValues.invoice_number,
      truck_plate: formValues.truck_plate,
      preco_custo: formValues.preco_custo,
      items: this.pendingItems().map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.unit_price
      }))
    };

    this.inboundService.create(payload).subscribe(() => {
      this.isNewFormOpen.set(false);
      this.loadInbounds();
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-50 text-green-700 border-green-200';
      case 'ABERTO': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELADO': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  }
}
