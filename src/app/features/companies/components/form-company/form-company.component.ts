import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CompaniesService } from '../../services/companies.service';

@Component({
  selector: 'app-form-company',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.scss',
})
export class FormCompanyComponent {
  private readonly companiesSvc = inject(CompaniesService);

  constructor() {
    this.companiesSvc
      .getAll()
      .then((companies) => console.log(companies))
      .catch((error) => console.error(error));
  }
}
