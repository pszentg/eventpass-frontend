// components/Event/FormBuilder.tsx

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface FormField {
  id: number;
  label: string;
  type: "text" | "radio" | "multiple_choice" | "dropdown" | "file";
  options?: string[];
}

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [fieldId, setFieldId] = useState(1);

  const addField = () => {
    setFields([...fields, { id: fieldId, label: "", type: "text" }]);
    setFieldId(fieldId + 1);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleLabelChange = (id: number, label: string) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, label } : field))
    );
  };

  const handleTypeChange = (
    id: number,
    type: "text" | "radio" | "multiple_choice" | "dropdown" | "file"
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              type,
              options: type !== "text" && type !== "file" ? [] : undefined,
            }
          : field
      )
    );
  };

  const handleOptionChange = (
    fieldId: number,
    optionIndex: number,
    optionValue: string
  ) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options!.map((option, index) =>
                index === optionIndex ? optionValue : option
              ),
            }
          : field
      )
    );
  };

  const addOption = (fieldId: number) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId
          ? { ...field, options: [...(field.options || []), ""] }
          : field
      )
    );
  };

  const removeOption = (fieldId: number, optionIndex: number) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options!.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : field
      )
    );
  };

  const handleSubmit = async () => {
    // Handle form submission
    // This is where you'd send the form data to your backend
    console.log("Submitted fields:", fields);
  };

  return (
    <Container style={{ marginTop: 16, padding: "8px 16px" }}>
      <Box>
        {fields.map((field, index) => (
          <Box key={field.id} display="flex" flexDirection="column" mb={2}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Label"
                variant="outlined"
                value={field.label}
                onChange={(e) => handleLabelChange(field.id, e.target.value)}
                style={{ marginRight: 8 }}
              />
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, marginRight: 8 }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  value={field.type}
                  onChange={(e) =>
                    handleTypeChange(
                      field.id,
                      e.target.value as
                        | "text"
                        | "radio"
                        | "multiple_choice"
                        | "dropdown"
                        | "file"
                    )
                  }
                  label="Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="radio">Radio Button</MenuItem>
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                  <MenuItem value="file">File Input</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => removeField(field.id)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
            {field.type !== "text" && field.type !== "file" && (
              <Box mt={2}>
                {field.options!.map((option, optionIndex) => (
                  <Box
                    key={optionIndex}
                    display="flex"
                    alignItems="center"
                    mb={1}
                  >
                    <TextField
                      label={`Option ${optionIndex + 1}`}
                      variant="outlined"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          field.id,
                          optionIndex,
                          e.target.value
                        )
                      }
                      style={{ marginRight: 8 }}
                    />
                    <IconButton
                      onClick={() => removeOption(field.id, optionIndex)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={() => addOption(field.id)}
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
    </Container>
  );
};

export default FormBuilder;
