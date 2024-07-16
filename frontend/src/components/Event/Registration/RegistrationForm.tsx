// src/components/RegistrationForm.tsx
import React from "react";
import { Field } from "@/types";

interface RegistrationFormProps {
  fields: Field[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ fields }) => {
  return (
    <form className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block font-bold text-gray-700 mb-2">
            {field.label}
          </label>
          {field.field_type === "text" && (
            <input
              type="text"
              required={field.required}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          {field.field_type === "dropdown" && (
            <select
              required={field.required}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.field_type === "radio" && (
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    name={field.label}
                    value={option}
                    required={field.required}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {field.field_type === "multiple_choice" && (
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <label key={idx} className="block">
                  <input
                    type="checkbox"
                    name={field.label}
                    value={option}
                    required={field.required}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </form>
  );
};

export default RegistrationForm;
