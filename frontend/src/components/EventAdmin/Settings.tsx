import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
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

interface EventData {
  id: string;
  groups: string[]; // group ids
  admins: any[];
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  client: string;
}

const EventAdminSettings = () => {
  const { data: events, error: eventsError } = useSWR<Event[]>(
    "/api/events",
    fetcher
  );
  const [selectedEvent, setSelectedEvent] = useState<string>(
    Cookies.get("selectedEvent") || ""
  );
  const { data: eventData, error: eventDataError } = useSWR<EventData>(
    selectedEvent ? `/api/events/${selectedEvent}` : null,
    fetcher
  );
  const [selectedGroup, setSelectedGroup] = useState<string>(
    Cookies.get("selectedGroup") || ""
  );
  const [groups, setGroups] = useState<Group[]>([]);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    setSelectedGroup("");
    setGroups([]); // Clear previous groups when a new event is selected
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
  };

  const handleSave = async () => {
    Cookies.set("selectedEvent", selectedEvent);
    Cookies.set("selectedGroup", selectedGroup);

    try {
      const response = await fetch("/api/save-selections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          groupId: selectedGroup,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save selections");
      }
    } catch (error) {
      console.error("Error saving selections:", error);
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (eventData && eventData.groups.length > 0) {
        const groupDetails = await Promise.all(
          eventData.groups.map(async (groupId) => {
            const group = await fetcher(`/api/groups/${groupId}`);
            return group;
          })
        );
        setGroups(groupDetails);
      }
    };

    fetchGroupDetails();
  }, [eventData]);

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
          {eventDataError ? (
            <div>Failed to load groups</div>
          ) : !eventData ? (
            <div>Loading groups...</div>
          ) : groups.length === 0 ? (
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
      <button onClick={handleSave} className={styles.saveButton}>
        Save
      </button>
    </div>
  );
};

export default EventAdminSettings;
