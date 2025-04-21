import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { ConfirmationService } from 'primeng/api';
import { MetaResponse } from '@/app/shared/interfaces/api.response.interface';
import { PermissionDirective } from '@/app/shared/directives/permission.directive';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ButtonGroup,
    TooltipModule,
    SkeletonModule,
    ProgressSpinnerModule,
    RouterModule,
    ConfirmPopupModule,
    PermissionDirective,
  ],
  providers: [ConfirmationService],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
})
export class ListUsersComponent {
  protected users!: User[];
  protected loading: boolean = false;
  private readonly usersSvc = inject(UsersService);
  private readonly confirmationSvc = inject(ConfirmationService);
  private readonly router = inject(Router);
  protected totalRecords: number = 0;
  protected currentPage: number = 1;
  protected rows: number = 5;

  ngOnInit(): void {
    this.getCompanies();
  }

  pageChange(event: any) {
    this.rows = event.rows;
    this.rows = event.rows;
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.getCompanies();
  }

  private async getCompanies() {
    this.loading = true;
    try {
      const { data, meta } = await this.usersSvc.getUsers({
        take: this.rows,
      });

      this.users = data;
      this.totalRecords = meta.itemCount || data.length;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  handleEdit(id: number) {
    this.router.navigate(['/usuarios/', id]);
  }

  handleCreate() {
    this.router.navigate(['/usuarios/crear']);
  }

  handleDelete(event: Event, id: number) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea eliminar este usuario?',
      header: 'Eliminar usuario',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersSvc.deleteUser(id).then(() => {
          this.getCompanies();
        });
      },
      reject: () => {},
    });
  }
}
