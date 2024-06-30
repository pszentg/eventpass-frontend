"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "../events.module.css";
import { AuthActions } from "@/app/auth/utils";
import { fetcher } from "@/app/auth/fetcher";
import { useParams, useRouter } from "next/navigation";

type Event = {
  id: number;
  name: string;
};

type Group = {
  id: number;
  name: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailPage = () => {
  const { getToken } = AuthActions();
  const params = useParams();
  const eventId = params.eventId as string;
  const [eventName, setEventName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: event,
    error: eventError,
    mutate: mutateEvent,
  } = useSWR<Event>(eventId ? `/api/events/${eventId}/` : null, fetcher);
  const { data: groups, error: groupsError } = useSWR<Group[]>(
    eventId ? `/api/get_groups_of_event/${eventId}/` : null,
    fetcher
  );

  useEffect(() => {
    if (event) {
      setEventName(event.name);
    }
  }, [event]);

  if (eventError)
    return <div className={styles.error}>Failed to load event</div>;
  if (groupsError)
    return <div className={styles.error}>Failed to load groups</div>;
  if (!event || !groups)
    return <div className={styles.loading}>Loading...</div>;

  const updateEventName = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${eventId}/`)
      .auth(`Bearer ${token}`)
      .put({ name: eventName })
      .res();
    setIsEditing(false);
    mutateEvent();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Edit Event</h1>
      <div>
        {isEditing ? (
          <>
            <input
              className={styles.input}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <button className={styles.button} onClick={updateEventName}>
              Save
            </button>
            <button
              className={styles.button}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className={styles.name}>{event.name}</span>
            <button
              className={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      <h2 className={styles.subheader}>Users in this event</h2>
      <ul className={styles.list}>
        {groups.map((group) => (
          <li key={group.id} className={styles.item}>
            <span className={styles.name}>{group.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventDetailPage;
