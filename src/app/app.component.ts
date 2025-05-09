import { Component } from '@angular/core';
import { LayoutComponent } from './core/components/layout/layout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'flext';
}
