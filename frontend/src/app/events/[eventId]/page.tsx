"use client";

// src/app/events/[eventId]/page.tsx
import React from "react";
import useSWR from "swr";
import { fetchRegistrationForm } from "@/api/api";
import RegistrationForm from "@/components/Event/Registration/RegistrationForm";
import { RegistrationFormType } from "@/types";
import { useParams } from "next/navigation";

const EventPage = () => {
  const params = useParams();
  const { eventId } = params;

  const { data, error } = useSWR<RegistrationFormType>(
    eventId ? `api/events/${eventId}/get_registration_form/` : null,
    () => fetchRegistrationForm(Number(eventId))
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-custom min-h-screen p-6">
      <div className="container mx-auto p-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Event Registration Form</h1>
        <RegistrationForm
          fields={data.fields}
          eventId={Number(eventId)}
          registrationFormId={Number(data.id)}
        />
      </div>
    </div>
  );
};

export default EventPage;
