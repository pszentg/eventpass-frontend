export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Field {
  label: string;
  field_type: string;
  options?: string[];
  required: boolean;
}

export interface RegistrationForm {
  event: number;
  created_at: string;
  updated_at: string;
  version_number: number;
  fields: Field[];
}
