import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { User } from '@/app/features/users/interfaces/user.interface';
import { TokenService } from '@/app/shared/services/token.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    RouterModule,
    CommonModule,
    AvatarModule,
    ButtonModule,
  ],
  providers: [TokenService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];
  user!: User;

  private readonly tokenSvc = inject(TokenService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.user = this.tokenSvc.getToken() as User;
    this.buildMenu();
  }

  logout() {
    this.tokenSvc.removeToken();
    this.router.navigate(['/iniciar-sesion']);
  }

  private buildMenu(): void {
    const menuItems: MenuItem[] = [];

    if (this.hasPermission('view:product')) {
      menuItems.push({
        label: 'Productos',
        icon: 'pi pi-home',
        route: '/productos',
      });
    }

    if (this.hasPermission('view:company')) {
      menuItems.push({
        label: 'Compañías',
        icon: 'pi pi-star',
        route: '/companias',
      });
    }

    if (this.hasPermission('view:user')) {
      menuItems.push({
        label: 'Usuarios',
        icon: 'pi pi-user',
        route: '/usuarios',
      });
    }

    this.items = menuItems;
  }

  private hasPermission(permissionName: string): boolean {
    if (!this.user || !this.user.role || !this.user.role.permissions) {
      return false;
    }

    return this.user.role.permissions.some((p) => p.name === permissionName);
  }
}
