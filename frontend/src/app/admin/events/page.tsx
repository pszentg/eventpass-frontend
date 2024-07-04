"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState, useContext } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "./events.module.css";
import Link from "next/link";
import UserContext from "@/context/UserContext";

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
  const [newEvent, setNewEvent] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
  });

  if (error) return <div>Failed to load events</div>;
  if (!events) return <div>Loading...</div>;

  const createEvent = async () => {
    if (!userContext?.user) return; // Ensure user is defined
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/`)
      .auth(`Bearer ${token}`)
      .post({ ...newEvent, client: userContext.user.id }) // Include client_id
      .res();
    setNewEvent({
      name: "",
      start_date: "",
      end_date: "",
      location: "",
      description: "",
    });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
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
        <div className={styles.formContainer}>
          <input
            className={styles.input}
            name="name"
            value={newEvent.name}
            onChange={handleInputChange}
            placeholder="Event Name"
          />
          <input
            className={styles.input}
            type="date"
            name="start_date"
            value={newEvent.start_date}
            onChange={handleInputChange}
            placeholder="Start Date"
          />
          <input
            className={styles.input}
            type="date"
            name="end_date"
            value={newEvent.end_date}
            onChange={handleInputChange}
            placeholder="End Date"
          />
          <input
            className={styles.input}
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            placeholder="Location"
          />
          <textarea
            className={styles.textarea}
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <button className={styles.submitButton} onClick={createEvent}>
            Submit
          </button>
        </div>
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
