import { Component } from '@angular/core';
import { FormProductComponent } from '../../components/form-product/form-product.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormProductComponent
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

}
