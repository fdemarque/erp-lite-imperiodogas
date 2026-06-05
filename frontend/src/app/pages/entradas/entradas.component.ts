import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InboundService, Inbound } from '../../services/inbound.service';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface Item {
  category: string;
  quantity: number;
  unitCost: number;
}

@Component({
  selector: 'app-entradas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './entradas.component.html',
})
export class EntradasComponent implements OnInit {
  private readonly inboundService = inject(InboundService);
  private readonly fb = inject(FormBuilder);

  formatDate = formatDate;
  formatCurrency = formatCurrency;

  search = '';
  isNewFormOpen = signal(false);

  CATEGORIES = [
    'GLP_13KG_CHEIO',
    'GLP_13KG_VAZIO',
    'GLP_20KG_CHEIO',
    'GLP_20KG_VAZIO',
    'GLP_45KG_CHEIO',
    'GLP_45KG_VAZIO'
  ];

  inbounds = signal<Inbound[]>([]);
  filteredInbounds = signal<Inbound[]>([]);

  inboundForm: FormGroup = this.fb.group({
    invoiceNumber: ['', Validators.required],
    truckPlate: ['', Validators.required]
  });

  pendingItems = signal<Item[]>([]);
  currentItem = { category: '', quantity: 1, unitCost: '' as string | number };

  ngOnInit() {
    this.loadInbounds();
  }

  loadInbounds() {
    this.inboundService.getAll().subscribe((data) => {
      this.inbounds.set(data);
      this.updateFiltered();
    });
  }

  updateFiltered() {
    const s = this.search.toLowerCase();
    this.filteredInbounds.set(this.inbounds().filter((i) =>
      (i.invoice_number && i.invoice_number.toLowerCase().includes(s)) ||
      (i.truck_plate && i.truck_plate.toLowerCase().includes(s))
    ));
  }

  handleOpenNew() {
    this.inboundForm.reset({ invoiceNumber: '', truckPlate: '' });
    this.pendingItems.set([]);
    this.resetCurrentItem();
    this.isNewFormOpen.set(true);
  }

  resetCurrentItem() {
    this.currentItem = { category: '', quantity: 1, unitCost: '' };
  }

  addItem() {
    let parsedPrice = 0;
    if (typeof this.currentItem.unitCost === 'string') {
      let clean = this.currentItem.unitCost;
      clean = clean.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      parsedPrice = parseFloat(clean);
    } else {
      parsedPrice = this.currentItem.unitCost;
    }

    if (!this.currentItem.category || this.currentItem.quantity <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) return;

    this.pendingItems.update(items => [
      ...items,
      {
        category: this.currentItem.category,
        quantity: this.currentItem.quantity,
        unitCost: parsedPrice
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
      invoiceNumber: formValues.invoiceNumber,
      truckPlate: formValues.truckPlate,
      items: this.pendingItems()
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
      default: return 'bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700';
    }
  }
}
