import { FormControl } from "@angular/forms";

export interface Auth {
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ResponseLogin {
  token: string;
}

export interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
