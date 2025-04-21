import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { ProductsService } from '../../services/products.service';
import { Product, ProductForm } from '../../interfaces/product.interface';
import { CompaniesService } from '@/app/features/companies/services/companies.service';
import { Company } from '@/app/features/companies/interfaces/company.interface';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    MessageModule,
  ],
  providers: [MessageService, CompaniesService],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent implements OnInit {
  productId = input<number | null>(null);

  public form!: FormGroup<ProductForm>;

  public loading: boolean = false;
  public submitting: boolean = false;
  public error!: string;
  public isEditMode: boolean = false;

  public companies: Company[] = [];

  private readonly productsSvc = inject(ProductsService);
  private readonly companiesSvc = inject(CompaniesService);
  private readonly messageSvc = inject(MessageService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();

    if (this.productId()) {
      this.isEditMode = true;
      this.loadProductData();
    }
  }

  private initForm(): void {
    this.form = new FormGroup<ProductForm>({
      name: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      category: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      price: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
      companyId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  private async loadCompanies(): Promise<void> {
    try {
      this.loading = true;
      const { data: companies } = await this.companiesSvc.getCompanies({
        take: 100,
      });
      this.companies = companies;
      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las compañías',
      });
      this.loading = false;
    }
  }

  private async loadProductData(): Promise<void> {
    if (!this.productId()) return;

    try {
      this.loading = true;
      const product = await this.productsSvc.getProductById(this.productId()!);
      console.log('Producto cargado:', product); // Depuración para ver la estructura exacta

      this.form.patchValue({
        name: product.name,
        category: product.category,
        price: (product.price || 0).toString(),
        companyId: product.companyId || product.company?.id,
      });

      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información del producto',
      });
      this.loading = false;
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos correctamente',
      });
      return;
    }

    this.submitting = true;

    try {
      const formValue = this.form.getRawValue();

      const productData: Product = {
        id: this.isEditMode ? this.productId()! : 0,
        name: formValue.name!,
        category: formValue.category!,
        price: parseFloat(formValue.price!),
        companyId: formValue.companyId!,
      };

      if (this.isEditMode) {
        await this.productsSvc.updateProduct(productData, this.productId()!);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto actualizado correctamente',
        });
      } else {
        await this.productsSvc.createProduct(productData);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto creado correctamente',
        });
        this.form.reset();
      }

      this.router.navigate(['/productos']);
    } catch (error: any) {
      console.log(error);
      if (error?.error?.message || error?.error?.details) {
        this.error = error?.error?.message || error?.error?.details;
      } else {
        this.messageSvc.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode
            ? 'No se pudo actualizar el producto'
            : 'No se pudo crear el producto',
        });
      }
    } finally {
      this.submitting = false;
    }
  }

  public handleCancel(): void {
    this.router.navigate(['/productos']);
  }

  public handleResetForm(): void {
    this.form.reset();
  }
}
