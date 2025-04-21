import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ButtonGroupModule,
    ConfirmDialogModule,
    TooltipModule,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss',
})
export class ListProductsComponent implements OnInit {
  protected products!: Product[];
  protected loading: boolean = false;
  private readonly productsSvc = inject(ProductsService);
  private readonly confirmationSvc = inject(ConfirmationService);
  private readonly router = inject(Router);
  protected totalRecords: number = 0;
  protected currentPage: number = 1;
  protected rows: number = 5;
  ngOnInit(): void {
    this.getProducts();
  }

  pageChange(event: any) {
    this.rows = event.rows;
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.getProducts();
  }

  private async getProducts() {
    this.loading = true;
    try {
      const { data, meta } = await this.productsSvc.getProducts({
        page: this.currentPage,
        take: this.rows,
      });

      this.products = data;
      this.totalRecords = meta.itemCount || data.length;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  handleEdit(id: number) {
    this.router.navigate(['/productos/', id]);
  }

  handleCreate() {
    this.router.navigate(['/productos/crear']);
  }

  handleDelete(event: Event, id: number) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea eliminar este producto?',
      header: 'Eliminar producto',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsSvc.deleteProduct(id).then(() => {
          this.getProducts();
        });
      },
      reject: () => {},
    });
  }
}
