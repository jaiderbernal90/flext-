import { FormControl } from "@angular/forms";
import { Company } from "../../companies/interfaces/company.interface";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  companyId: number;
  company?: Company;
}

export interface ProductForm {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  price: FormControl<string | null>;
  companyId: FormControl<number | null>;
}
