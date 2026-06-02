import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService, StockBalance, StockHistory } from '../../services/stock.service';
import { ProductService, Product } from '../../services/product.service';
import { formatDate, formatCurrency } from '../../utils/formatters';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './estoque.component.html',
})
export class EstoqueComponent implements OnInit {
  private readonly stockService = inject(StockService);
  private readonly productService = inject(ProductService);

  formatDate = formatDate;
  formatCurrency = formatCurrency;

  activeTab = signal<'SALDO' | 'HISTORICO'>('SALDO');

  // Saldo
  balances = signal<StockBalance[]>([]);
  
  // Produtos (modal)
  isProductModalOpen = signal(false);
  productForm = { name: '', current_price: 0, status: 'ATIVO' };
  productsList = signal<Product[]>([]);

  // Histórico
  history = signal<StockHistory[]>([]);
  filters = { nf: '', truck_plate: '', product_id: '' };

  ngOnInit() {
    this.loadBalances();
    this.loadProducts();
  }

  // --- TAB SALDO E PRODUTOS ---

  loadBalances() {
    this.stockService.getCurrentStock().subscribe((data) => {
      this.balances.set(data);
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe((data) => {
      this.productsList.set(data);
    });
  }

  handleOpenNewProduct() {
    this.productForm = { name: '', current_price: 0, status: 'ATIVO' };
    this.isProductModalOpen.set(true);
  }

  handleSaveProduct() {
    this.productService.create(this.productForm).subscribe(() => {
      this.isProductModalOpen.set(false);
      this.loadProducts();
      this.loadBalances();
    });
  }

  // --- TAB HISTÓRICO ---

  loadHistory() {
    this.stockService.getStockHistory(this.filters).subscribe((data) => {
      this.history.set(data);
    });
  }

  applyFilters() {
    this.loadHistory();
  }

  switchTab(tab: 'SALDO' | 'HISTORICO') {
    this.activeTab.set(tab);
    if (tab === 'HISTORICO') {
      this.loadHistory();
    } else {
      this.loadBalances();
    }
  }

  getMovementClass(type: string) {
    if (type === 'ENTRADA') return 'bg-green-50 text-green-700 border-green-200';
    if (type === 'SAIDA') return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}
