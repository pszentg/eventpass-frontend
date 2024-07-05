"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState, useContext } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "./events.module.css";
import Link from "next/link";
import UserContext from "@/context/UserContext";
import EventForm, { NewEvent } from "@/components/Event/EventForm"; // Updated import path

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Event = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
};

const EventsPage = () => {
  const { getToken } = AuthActions();
  const userContext = useContext(UserContext); // Accessing the user context
  const {
    data: events,
    error,
    mutate,
  } = useSWR<Event[]>("/api/events/", fetcher);
  const [showForm, setShowForm] = useState(false);

  if (error) return <div>Failed to load events</div>;
  if (!events) return <div>Loading...</div>;

  const createEvent = async (newEvent: NewEvent) => {
    if (!userContext?.user) return; // Ensure user is defined
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/`)
      .auth(`Bearer ${token}`)
      .post({ ...newEvent, client: userContext.user.id }) // Include client_id
      .res();
    setShowForm(false);
    mutate(); // Revalidate the data
  };

  const updateEvent = async (event: Event) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${event.id}/`)
      .auth(`Bearer ${token}`)
      .put(event)
      .res();
    mutate(); // Revalidate the data
  };

  const deleteEvent = async (id: number) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${id}/`)
      .auth(`Bearer ${token}`)
      .delete()
      .res();
    mutate(); // Revalidate the data
  };

  return (
    <div className={styles.container}>
      <h1>Events</h1>
      <button
        className={styles.addButton}
        onClick={() => setShowForm(!showForm)}
      >
        Add Event
      </button>
      {showForm && (
        <EventForm
          createEvent={createEvent}
          onCancel={() => setShowForm(false)}
        />
      )}
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id} className={styles.item}>
            <span className={styles.name}>{event.name}</span>
            <Link href={`/admin/events/${event.id}`}>
              <div className={styles.button}>Edit</div>
            </Link>
            <button
              className={styles.button}
              onClick={() => deleteEvent(event.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
