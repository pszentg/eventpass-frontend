// src/components/RegistrationForm.tsx
import React, { useState } from "react";
import {
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { Field } from "@/types";
import wretch from "wretch";
import { AuthActions } from "@/app/auth/utils";

interface RegistrationFormProps {
  fields: Field[];
  eventId: number;
  registrationFormId: number;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  fields,
  eventId,
  registrationFormId,
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { getToken } = AuthActions();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormValues({
        ...formValues,
        [name]: target.checked,
      });
    } else if (type === "radio") {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await wretch(`${API_BASE_URL}/api/events/${eventId}/submit_registration/`)
        .auth(`Bearer ${getToken("access")}`)
        .post({ ...formValues, registration_form: registrationFormId })
        .res();
      alert("Registration submitted successfully!");
    } catch (error) {
      alert("Failed to submit registration.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {fields.map((field, index) => (
        <FormControl key={index} fullWidth margin="normal">
          <label className="block font-bold text-gray-700 mb-2">
            {field.label}
          </label>
          {field.field_type === "text" && (
            <TextField
              fullWidth
              name={field.label}
              required={field.required}
              onChange={handleChange}
            />
          )}
          {field.field_type === "dropdown" && (
            <TextField
              select
              SelectProps={{
                native: true,
              }}
              fullWidth
              name={field.label}
              required={field.required}
              onChange={handleChange}
            >
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          )}
          {field.field_type === "radio" && (
            <RadioGroup name={field.label} onChange={handleChange}>
              {field.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio required={field.required} />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}
          {field.field_type === "multiple_choice" && (
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      name={field.label}
                      value={option}
                      onChange={handleChange}
                    />
                  }
                  label={option}
                />
              ))}
            </div>
          )}
        </FormControl>
      ))}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default RegistrationForm;
