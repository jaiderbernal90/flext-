import { FormControl } from '@angular/forms';
import { City, Department } from './location.interface';

export interface Company {
  id: number;
  name: string;
  sector: string;
  departmentId: number;
  cityId: number;
  activesAndPassives: string;
  phone: string;
  address: string;
  department?: Department;
  city?: City;
}

export interface CompanyForm {
  name: FormControl<string | null>;
  sector: FormControl<string | null>;
  phone: FormControl<string | null>;
  address: FormControl<string | null>;
  activesAndPassives: FormControl<string | null>;
  cityId: FormControl<number | null>;
  departmentId: FormControl<number | null>;
}
