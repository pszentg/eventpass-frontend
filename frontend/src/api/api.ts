// src/utils/api.ts
import { RegistrationFormType } from "@/types";
import wretch from "wretch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const api = wretch(API_BASE_URL);

export const fetchRegistrationForm = (
  eventId: number,
  versionNumber?: number
): Promise<RegistrationFormType> => {
  const url = versionNumber
    ? `/api/events/${eventId}/get_registration_form/?version_number=${versionNumber}`
    : `/api/events/${eventId}/get_registration_form/`;
  return api.url(url).get().json();
};
