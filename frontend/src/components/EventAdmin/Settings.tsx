import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/auth/fetcher";
import styles from "./settings.module.css";

interface Event {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
}

const EventAdminSettings = () => {
  const { data: events, error: eventsError } = useSWR<Event[]>(
    "/api/events",
    fetcher
  );
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const { data: groups, error: groupsError } = useSWR<Group[]>(
    selectedEvent ? `/api/events/${selectedEvent}/groups` : null,
    fetcher
  );
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    setSelectedGroup("");
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value);
  };

  if (eventsError) return <div>Failed to load events</div>;
  if (!events) return <div>Loading events...</div>;

  return (
    <div className={styles.adminSettings}>
      <h2>Event Admin Settings</h2>
      <hr className={styles.divider} />
      <div className={styles.field}>
        <label htmlFor="eventSelect">Select Event:</label>
        <select
          id="eventSelect"
          value={selectedEvent}
          onChange={handleEventChange}
          className={styles.settingsInput}
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>
      {selectedEvent && (
        <div className={styles.field}>
          <label htmlFor="groupSelect">Select Group:</label>
          {groupsError ? (
            <div>Failed to load groups</div>
          ) : !groups ? (
            <div>Loading groups...</div>
          ) : (
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={handleGroupChange}
              className={styles.settingsInput}
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      {/* Add more admin settings form or content here */}
    </div>
  );
};

export default EventAdminSettings;
