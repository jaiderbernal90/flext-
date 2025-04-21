import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ILoginForm } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';
import { MessageModule } from 'primeng/message';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loading: boolean = false;
  public error!: string;
  public form!: FormGroup<ILoginForm>;
  private readonly authSvc = inject(AuthService);
  private router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {}

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('token')) {
      this.router.navigate(['/companias']);
    }
    this.initForm();
  }

  public onSubmit(): void {
    this.loading = true;

    const data = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    this.authSvc
      .login(data)
      .then((response) => {
        console.log(response);
        const { token } = response;
        if (isPlatformBrowser(this.platformId))
          sessionStorage.setItem('token', token);

        this.loading = false;
        this.router.navigate(['/companias']);
      })
      .catch((error) => {
        if (error?.error?.message || error.error.details) {
          this.error = error?.error?.message || error?.error?.details;
        }
        this.loading = false;
      });
  }

  public handleResetForm(): void {
    this.form.reset();
  }

  private initForm(): void {
    this.form = new FormGroup({
      password: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      }),
      email: new FormControl<string | null>(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
        ],
      }),
    });
  }
}
