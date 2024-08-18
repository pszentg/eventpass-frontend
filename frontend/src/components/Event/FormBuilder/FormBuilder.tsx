// components/Event/FormBuilder.tsx
"use client";

import React, { useEffect, useState } from "react";
import wretch from "wretch";

import {
  TextField,
  Button,
  Box,
  Container,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { AuthActions } from "@/app/auth/utils";
import { RegistrationFormType, RegistrationFieldType } from "@/types";

interface FormBuilderProps {
  eventId: string;
  initialForm?: RegistrationFormType;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ eventId, initialForm }) => {
  const [formVersion, setFormVersion] = useState<number | undefined>(
    initialForm?.version_number
  );
  const [fields, setFields] = useState<RegistrationFieldType[]>(
    initialForm?.fields || []
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { getToken } = AuthActions();

  useEffect(() => {
    if (initialForm) {
      setFormVersion(initialForm.version_number);
      setFields(initialForm.fields);
    }
  }, [initialForm]);

  const addField = () => {
    setFields([...fields, { label: "", field_type: "text", required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleLabelChange = (index: number, label: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], label };
    setFields(newFields);
  };

  const handleTypeChange = (
    index: number,
    field_type: "text" | "radio" | "multiple_choice" | "dropdown"
  ) => {
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      field_type,
      options: field_type !== "text" ? [] : undefined,
    };
    setFields(newFields);
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    optionValue: string
  ) => {
    const newFields = [...fields];
    newFields[fieldIndex].options![optionIndex] = optionValue;
    setFields(newFields);
  };

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields];
    if (!newFields[fieldIndex].options) {
      newFields[fieldIndex].options = [];
    }
    newFields[fieldIndex].options!.push("");
    setFields(newFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options!.filter(
      (_, i) => i !== optionIndex
    );
    setFields(newFields);
  };

  const handleSubmit = async () => {
    try {
      await wretch(
        `${BASE_URL}/api/events/${eventId}/create_registration_form/`
      )
        .auth(`Bearer ${await getToken("access")}`)
        .post({ fields })
        .json();

      setSnackbarMessage("Form submitted successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Error submitting form");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container style={{ marginTop: 16, padding: "8px 16px" }}>
      <Box>
        {fields.map((field, index) => (
          <Box key={index} display="flex" flexDirection="column" mb={2}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Label"
                variant="outlined"
                value={field.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                style={{ marginRight: 8 }}
              />
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, marginRight: 8 }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  value={field.field_type}
                  onChange={(e) =>
                    handleTypeChange(
                      index,
                      e.target.value as
                        | "text"
                        | "radio"
                        | "multiple_choice"
                        | "dropdown"
                    )
                  }
                  label="Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="radio">Radio Button</MenuItem>
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => removeField(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
            {field.field_type !== "text" && (
              <Box mt={2}>
                {field.options!.map((option, optionIndex) => (
                  <Box
                    key={optionIndex}
                    display="flex"
                    alignItems="center"
                    mb={2}
                  >
                    <TextField
                      label={`Option ${optionIndex + 1}`}
                      variant="outlined"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e.target.value)
                      }
                      style={{ marginRight: 8 }}
                    />
                    <IconButton
                      onClick={() => removeOption(index, optionIndex)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={() => addOption(index)}
                >
                  Add Option
                </Button>
              </Box>
            )}
            {index < fields.length - 1 && (
              <Divider style={{ margin: "16px 0" }} />
            )}
          </Box>
        ))}
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={addField}
          style={{ marginTop: 16 }}
        >
          Add Field
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: 16 }}
      >
        Save Form
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FormBuilder;
