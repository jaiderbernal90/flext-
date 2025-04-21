import { Component, input } from '@angular/core';
import { FormUserComponent } from '../../components/form-user/form-user.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormUserComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  id = input<number | null>(null);

}
