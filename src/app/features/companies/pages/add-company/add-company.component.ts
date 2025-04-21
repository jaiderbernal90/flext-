import { Component } from '@angular/core';
import { FormCompanyComponent } from '../../components/form-company/form-company.component';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [
    FormCompanyComponent,
  ],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {

}
