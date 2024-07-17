"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import { AuthActions } from "@/app/auth/utils";
import { fetcher } from "@/app/auth/fetcher";
import { useParams, useRouter } from "next/navigation";
import AddGroupForm from "@/components/Group/AddGroupForm";
import GroupList from "@/components/Group/GroupList";
import FormBuilder from "@/components/Event/FormBuilder/FormBuilder";
import { RegistrationFormType } from "@/types";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

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

  const { data: registrationForm, error: registrationFormError } =
    useSWR<RegistrationFormType>(
      eventId ? `/api/events/${eventId}/get_registration_form/` : null,
      fetcher,
      {
        onError: (error) => {
          if (error.status !== 404) {
            console.error("Failed to load registration form:", error);
          }
        },
      }
    );

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
    return (
      <Container>
        <Typography color="error">Failed to load event</Typography>
      </Container>
    );
  if (!event)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

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

  const handleAddGroup = async (groupName: string) => {
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

  const emptyRegistrationForm: RegistrationFormType = {
    id: 0,
    event: Number(eventId),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_number: 1,
    fields: [],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Event
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        {isEditing ? (
          <>
            <TextField
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              variant="outlined"
              style={{ marginRight: 8 }}
            />
            <IconButton onClick={updateEventName} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} color="secondary">
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h6" style={{ marginRight: 8 }}>
              {event.name}
            </Typography>
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <Edit />
            </IconButton>
          </>
        )}
      </Box>
      <Typography variant="h5" gutterBottom>
        Create registration form
      </Typography>
      {registrationForm && (
        <Typography variant="subtitle1" gutterBottom>
          Form Version: {registrationForm.version_number}
        </Typography>
      )}
      {registrationFormError && registrationFormError.status !== 404 ? (
        <Typography color="error">Failed to load registration form</Typography>
      ) : (
        <FormBuilder
          eventId={eventId as string}
          initialForm={registrationForm || emptyRegistrationForm}
        />
      )}
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Groups in this event</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddingGroup(true)}
          >
            Add Group
          </Button>
        </Box>
        {isAddingGroup && (
          <AddGroupForm
            onAddGroup={handleAddGroup}
            onCancel={() => setIsAddingGroup(false)}
          />
        )}
        <GroupList groups={eventGroups} onEditGroup={handleGroupEdit} />
      </Box>
    </Container>
  );
};

export default EventDetailPage;
