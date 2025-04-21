import { Component, input } from '@angular/core';
import { FormProductComponent } from '../../components/form-product/form-product.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormProductComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent {
  id = input<number | null>(null);
}
