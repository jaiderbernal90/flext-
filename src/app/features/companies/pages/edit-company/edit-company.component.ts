import { Component } from '@angular/core';
import { FormCompanyComponent } from '../../components/form-company/form-company.component';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [FormCompanyComponent],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss',
})
export class EditCompanyComponent {}
