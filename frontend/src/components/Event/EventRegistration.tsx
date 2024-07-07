// components/Event/EventRegistration.tsx
import React, { useState, useEffect } from "react";
import FormBuilder from "./FormBuilder";
import Form from "@rjsf/core";
import wretch from "wretch";
import styles from "./EventRegistration.module.css";

type FormField = {
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type EventRegistrationProps = {
  eventId: string;
};

const EventRegistration = ({ eventId }: EventRegistrationProps) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      const fetchedFields = await wretch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/form-fields/`
      )
        .get()
        .json<FormField[]>();
      setFormFields(fetchedFields);
    };

    fetchFields();
  }, [eventId]);

  const schema = {
    type: "object",
    properties: formFields.reduce((acc, field, index) => {
      acc[`field_${index}`] = {
        type: field.type === "textarea" ? "string" : field.type,
        title: field.label,
        enum: field.options,
      };
      return acc;
    }, {}),
    required: formFields
      .filter((field) => field.required)
      .map((_, index) => `field_${index}`),
  };

  const handleSubmit = async ({ formData }: { formData: any }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await wretch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/register/`
      )
        .post({ data: formData })
        .json();
      alert("Registration successful!");
    } catch (err) {
      setError("Failed to register for the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.eventRegistration}>
      <h2>Event Registration</h2>
      <FormBuilder formFields={formFields} setFormFields={setFormFields} />
      <h3>Register for Event</h3>
      {error && <div className={styles.error}>{error}</div>}
      <Form
        schema={schema}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
      />
    </div>
  );
};

export default EventRegistration;
