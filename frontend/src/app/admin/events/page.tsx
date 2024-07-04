"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "./events.module.css";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Event = {
  id: number;
  name: string;
};

const EventsPage = () => {
  const { getToken } = AuthActions();
  const {
    data: events,
    error,
    mutate,
  } = useSWR<Event[]>("/api/events/", fetcher);
  const [newEventName, setNewEventName] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  if (error) return <div>Failed to load events</div>;
  if (!events) return <div>Loading...</div>;

  const createEvent = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/`)
      .auth(`Bearer ${token}`)
      .post({ name: newEventName })
      .res();
    setNewEventName("");
    mutate(); // Revalidate the data
  };

  const updateEvent = async (event: Event) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${event.id}/`)
      .auth(`Bearer ${token}`)
      .put(event)
      .res();
    setEditingEvent(null);
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
      <div className={styles.addContainer}>
        <input
          className={styles.addInput}
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          placeholder="New event name"
        />
        <button className={styles.addButton} onClick={createEvent}>
          Add Event
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
