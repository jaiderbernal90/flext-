import { FormControl } from '@angular/forms';
import { Company } from '../../companies/interfaces/company.interface';

export interface User {
  id: number;
  phone: string;
  email: string;
  password: string;
  position: string;
  name: string;
  salary: string;
  lastName: string;
  roleId: number;
  companyId: number;
  role?: Role;
  company?: Company;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    id: number;
    name: string;
  }[];
}

export interface UserForm {
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  position: FormControl<string | null>;
  salary: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  companyId: FormControl<number | null>;
  roleId: FormControl<number | null>;
  password: FormControl<string | null>;
}
