import { Component, inject, input, OnInit } from '@angular/core';
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
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { Role, User, UserForm } from '../../interfaces/user.interface';
import { PasswordModule } from 'primeng/password';
import { CompaniesService } from '@/app/features/companies/services/companies.service';
import { Company } from '@/app/features/companies/interfaces/company.interface';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
  ],
  providers: [MessageService, CompaniesService],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss',
})
export class FormUserComponent implements OnInit {
  userId = input<number | null>(null);

  public form!: FormGroup<UserForm>;

  public loading: boolean = false;
  public submitting: boolean = false;
  public error!: string;
  public isEditMode: boolean = false;

  public companies: Company[] = [];
  public roles: Role[] = [];
  public positions: { name: string; value: string }[] = [
    { name: 'Gerente', value: 'Gerente' },
    { name: 'Supervisor', value: 'Supervisor' },
    { name: 'Analista', value: 'Analista' },
    { name: 'Desarrollador', value: 'Desarrollador' },
    { name: 'Asistente', value: 'Asistente' },
    { name: 'Contador', value: 'Contador' },
    { name: 'Recursos Humanos', value: 'Recursos Humanos' },
    { name: 'Marketing', value: 'Marketing' },
    { name: 'Ventas', value: 'Ventas' },
    { name: 'Otro', value: 'Otro' },
  ];

  private readonly usersSvc = inject(UsersService);
  private readonly messageSvc = inject(MessageService);
  private readonly companiesSvc = inject(CompaniesService);
  private readonly rolesSvc = inject(RolesService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadCompanies();

    if (this.userId()) {
      this.isEditMode = true;
      this.loadUserData();
    }
  }

  private initForm(): void {
    this.form = new FormGroup<UserForm>({
      name: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      }),
      lastName: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      }),
      position: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      salary: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
      password: new FormControl<string | null>(null, {
        validators: [
          ...(!this.userId() ? [Validators.required] : []),
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      }),
      phone: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s()]{7,20}$/),
        ],
      }),
      email: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
        ],
      }),
      companyId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      roleId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  private async loadCompanies(): Promise<void> {
    try {
      this.loading = true;
      const { data: companies } = await this.companiesSvc.getCompanies();
      this.form.get('companyId')?.setValue(null);
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

  private async loadRoles(): Promise<void> {
    try {
      this.loading = true;
      const roles = await this.rolesSvc.getRoles();
      this.roles = roles;
      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los roles',
      });
      this.loading = false;
    }
  }

  private async loadUserData(): Promise<void> {
    if (!this.userId()) return;

    try {
      this.loading = true;
      const user = await this.usersSvc.getUserById(this.userId()!);

      this.form.patchValue({
        name: user.name,
        lastName: user.lastName,
        position: user.position,
        salary: user.salary,
        phone: user.phone,
        email: user.email,
        companyId: user.companyId,
      });

      this.loading = false;
    } catch (error) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información del usuario',
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

      const userData: User = {
        id: this.isEditMode ? this.userId()! : 0,
        name: formValue.name!,
        lastName: formValue.lastName!,
        position: formValue.position!,
        salary: parseFloat(formValue.salary!).toString(),
        password: formValue.password!,
        phone: formValue.phone!,
        email: formValue.email!,
        companyId: formValue.companyId!,
        roleId: formValue.roleId!,
      };

      console.log(userData);

      if (this.isEditMode) {
        await this.usersSvc.updateUser(userData, this.userId()!);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario actualizado correctamente',
        });
      } else {
        await this.usersSvc.createUser(userData);
        this.messageSvc.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario creado correctamente',
        });
        this.form.reset();
      }

      this.router.navigate(['/usuarios']);
    } catch (error: any) {
      console.log(error);
      if (error?.error?.message || error?.error?.details) {
        this.error = error?.error?.message || error?.error?.details;
      } else {
        this.messageSvc.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode
            ? 'No se pudo actualizar el usuario'
            : 'No se pudo crear el usuario',
        });
      }
    } finally {
      this.submitting = false;
    }
  }

  public handleCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  public handleResetForm(): void {
    this.form.reset();
  }
}
