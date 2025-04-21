import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Company } from '../../interfaces/company.interface';
import { CompaniesService } from '../../services/companies.service';
import { MetaResponse } from '@/app/shared/interfaces/api.response.interface';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list-companies',
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
  ],
  providers: [ConfirmationService],
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.scss',
})
export class ListCompaniesComponent implements OnInit {
  protected companies!: Company[];
  protected loading: boolean = false;
  private readonly companiesSvc = inject(CompaniesService);
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
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.getCompanies();
  }

  private async getCompanies() {
    this.loading = true;
    try {
      const { data, meta } = await this.companiesSvc.getCompanies({
        page: this.currentPage,
        take: this.rows,
      });

      this.companies = data;
      this.totalRecords = meta.itemCount || data.length;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  handleEdit(id: number) {
    this.router.navigate(['/companias/', id]);
  }

  handleCreate() {
    this.router.navigate(['/companias/crear']);
  }

  handleDelete(event: Event, id: number) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea eliminar esta compañia?',
      header: 'Eliminar compañia',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.companiesSvc.deleteCompany(id).then(() => {
          this.getCompanies();
        });
      },
      reject: () => {},
    });
  }
}
