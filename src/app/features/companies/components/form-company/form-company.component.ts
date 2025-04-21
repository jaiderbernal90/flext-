import { Component, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { CompaniesService } from '../../services/companies.service';
import { LocationsService } from '../../services/location.service';
import { City, Department } from '../../interfaces/location.interface';
import { Company, CompanyForm } from '../../interfaces/company.interface';

@Component({
  selector: 'app-form-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    MessageModule,
  ],
  providers: [MessageService, CompaniesService, LocationsService],
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.scss',
})
export class FormCompanyComponent implements OnInit {
  companyId = input<number | null>(null);

  public form!: FormGroup<CompanyForm>;

  public loading: boolean = false;
  public submitting: boolean = false;
  public error!: string;
  public isEditMode: boolean = false;

  public departments: Department[] = [];
  public cities: City[] = [];
  public filteredCities: City[] = [];

  private readonly companiesSvc = inject(CompaniesService);
  private readonly locationsSvc = inject(LocationsService);
  private readonly messageSvc = inject(MessageService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();

    if (this.companyId()) {
      this.isEditMode = true;
      this.loadCompanyData();
    }
  }

  private initForm(): void {
    this.form = new FormGroup<CompanyForm>({
      name: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      sector: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      phone: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s()]{7,20}$/),
        ],
      }),
      address: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      activesAndPassives: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
      departmentId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      cityId: new FormControl<number | null>(
        { value: null, disabled: true },
        {
          validators: [Validators.required],
        }
      ),
    });

    this.form
      .get('departmentId')
      ?.valueChanges.subscribe(async (departmentId) => {
        if (departmentId) {
          await this.loadCities(departmentId);
          this.form.get('cityId')?.enable();
        } else {
          this.filteredCities = [];
          this.form.get('cityId')?.disable();
          this.form.get('cityId')?.setValue(null);
        }
      });
  }

  private async loadDepartments(): Promise<void> {
    try {
      this.loading = true;
      this.departments = await this.locationsSvc.getDepartments();
      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los departamentos',
      });
      this.loading = false;
    }
  }

  private async loadCities(departmentId: number): Promise<void> {
    try {
      this.loading = true;
      this.cities = await this.locationsSvc.getCitiesByDepartmentId(
        departmentId
      );
      this.filteredCities = this.cities;
      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las ciudades',
      });
      this.loading = false;
    }
  }

  private async loadCompanyData(): Promise<void> {
    if (!this.companyId()) return;

    try {
      this.loading = true;
      const company = await this.companiesSvc.getCompanyById(this.companyId()!);

      const departmentId = company.department?.id || company.departmentId;
      await this.loadCities(departmentId);

      this.form
        .get('departmentId')
        ?.setValue(departmentId, { emitEvent: false });

      this.form.get('cityId')?.enable();

      const cityId = company.city?.id || company.cityId;

      this.form.patchValue({
        name: company.name,
        sector: company.sector,
        departmentId: departmentId,
        cityId: cityId,
        activesAndPassives: company.activesAndPassives,
        phone: company.phone,
        address: company.address,
      });

      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información de la compañía',
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

      const companyData: Company = {
        id: this.isEditMode ? this.companyId()! : 0,
        name: formValue.name!,
        sector: formValue.sector!,
        departmentId: formValue.departmentId!,
        cityId: formValue.cityId!,
        activesAndPassives: formValue.activesAndPassives!.toString(),
        phone: formValue.phone!,
        address: formValue.address!,
      };

      console.log(companyData);

      if (this.isEditMode) {
        await this.companiesSvc.updateCompany(companyData, this.companyId()!);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Compañía actualizada correctamente',
        });
      } else {
        await this.companiesSvc.createCompany(companyData);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Compañía creada correctamente',
        });
        this.form.reset();
      }

      this.router.navigate(['/companias']);
    } catch (error: any) {
      console.log(error);
      if (error?.error?.message || error?.error?.details) {
        this.error = error?.error?.message || error?.error?.details;
      } else {
        this.messageSvc.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode
            ? 'No se pudo actualizar la compañía'
            : 'No se pudo crear la compañía',
        });
      }
    } finally {
      this.submitting = false;
    }
  }

  public handleCancel(): void {
    this.router.navigate(['/companias']);
  }

  public handleResetForm(): void {
    this.form.reset();
  }
}
