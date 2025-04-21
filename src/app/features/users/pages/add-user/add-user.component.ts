import { Component } from '@angular/core';
import { FormUserComponent } from '../../components/form-user/form-user.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormUserComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {}
