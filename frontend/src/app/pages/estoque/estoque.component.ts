import { Component, signal, OnInit, inject } from '@angular/core';
import { InboundService } from '../../services/inbound.service';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface Lot {
  inboundDate: string;
  category: string;
  availableQuantity: number;
  unitCost: number;
  invoiceNumber: string;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  templateUrl: './estoque.component.html',
})
export class EstoqueComponent implements OnInit {
  private readonly inboundService = inject(InboundService);

  formatDate = formatDate;
  formatCurrency = formatCurrency;

  lots = signal<Lot[]>([]);

  ngOnInit() {
    this.loadLots();
  }

  loadLots() {
    this.inboundService.getAll().subscribe((inbounds) => {
      const availableLots: Lot[] = [];
      inbounds.forEach(inbound => {
        if (inbound.items) {
          inbound.items.forEach(item => {
            if (item.availableQuantity > 0) {
              availableLots.push({
                inboundDate: inbound.created_at,
                category: item.category,
                availableQuantity: item.availableQuantity,
                unitCost: item.unitCost,
                invoiceNumber: inbound.invoice_number
              });
            }
          });
        }
      });
      this.lots.set(availableLots);
    });
  }
}
