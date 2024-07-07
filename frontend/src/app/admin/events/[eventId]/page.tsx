"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "../events.module.css";
import { AuthActions } from "@/app/auth/utils";
import { fetcher } from "@/app/auth/fetcher";
import { useParams, useRouter } from "next/navigation";
import AddGroupForm from "@/components/Group/AddGroupForm";
import GroupList from "@/components/Group/GroupList";
import { Container, Typography } from "@mui/material";
import FormBuilder from "@/components/Event/FormBuilder";

type Event = {
  id: number;
  name: string;
  groups: number[]; // Array of group IDs
};

type Group = {
  id: number;
  name: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const EventDetailPage = () => {
  const { getToken } = AuthActions();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const [eventName, setEventName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [eventGroups, setEventGroups] = useState<Group[]>([]);

  const {
    data: event,
    error: eventError,
    mutate: mutateEvent,
  } = useSWR<Event>(eventId ? `/api/events/${eventId}/` : null, fetcher);

  useEffect(() => {
    if (event) {
      setEventName(event.name);
      filterEventGroups(event.groups);
    }
  }, [event, allGroups]);

  useEffect(() => {
    const fetchAllGroups = async () => {
      const token = await getToken("access");
      const groups = await wretch(`${BASE_URL}/api/groups/`)
        .auth(`Bearer ${token}`)
        .get()
        .json<Group[]>();
      setAllGroups(groups);
    };

    fetchAllGroups();
  }, []);

  const filterEventGroups = (groupIds: number[]) => {
    const filteredGroups = allGroups.filter((group) =>
      groupIds.includes(group.id)
    );
    setEventGroups(filteredGroups);
  };

  if (eventError)
    return <div className={styles.error}>Failed to load event</div>;
  if (!event) return <div className={styles.loading}>Loading...</div>;

  const updateEventName = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${eventId}/`)
      .auth(`Bearer ${token}`)
      .put({ name: eventName })
      .res();
    setIsEditing(false);
    mutateEvent();
  };

  const handleGroupEdit = (groupId: number) => {
    router.push(`/admin/groups/${groupId}`);
  };

  const handleAddGroup = async () => {
    const token = await getToken("access");

    let groupId = null;

    try {
      // Construct the URL with query parameters
      const queryUrl = new URL(`${BASE_URL}/api/groups/filter-by-name/`);
      queryUrl.searchParams.append("name", newGroupName);

      // First request to check if the group exists
      const existingGroup = await wretch(queryUrl.toString())
        .auth(`Bearer ${token}`)
        .get()
        .json<{ id: number; name: string }[]>();

      console.log(existingGroup);

      if (existingGroup.length > 0) {
        // Group exists
        groupId = existingGroup[0].id;
      } else {
        // Group does not exist, create it
        const createdGroup = await wretch(`${BASE_URL}/api/groups/`)
          .auth(`Bearer ${token}`)
          .post({ name: newGroupName })
          .json<{ id: number; name: string }>();

        groupId = createdGroup.id;
      }

      // Second request to add the group to the event
      await wretch(`${BASE_URL}/api/events/add-group-to-event/`)
        .auth(`Bearer ${token}`)
        .post({ event_id: eventId, group_id: groupId })
        .res();

      setIsAddingGroup(false);
      setNewGroupName("");
      mutateEvent(); // Refresh the event data to include the new group
    } catch (error) {
      console.error("Error adding group to event:", error);
      // Handle error appropriately
    }
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
      <h2 className={styles.h2}> Create registration form</h2>
      <FormBuilder />
      <div className={styles.headerContainer}>
        <h2 className={styles.subheader}>Groups in this event</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsAddingGroup(true)}
        >
          Add Group
        </button>
      </div>
      {isAddingGroup && (
        <AddGroupForm
          onAddGroup={handleAddGroup}
          onCancel={() => setIsAddingGroup(false)}
        />
      )}
      <GroupList groups={eventGroups} onEditGroup={handleGroupEdit} />
    </div>
  );
};

export default EventDetailPage;
