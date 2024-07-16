export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegistrationFieldType {
  label: string;
  field_type: "text" | "radio" | "multiple_choice" | "dropdown";
  options?: string[];
  required: boolean;
}

export interface RegistrationFormType {
  id: number;
  event: number;
  created_at: string;
  updated_at: string;
  version_number: number;
  fields: RegistrationFieldType[];
}
