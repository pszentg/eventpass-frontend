"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch, { WretchError } from "wretch";
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
  Snackbar,
  Alert,
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
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [eventGroups, setEventGroups] = useState<Group[]>([]);

  const emptyRegistrationForm: RegistrationFormType = {
    id: 0,
    event: Number(eventId),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_number: 1,
    fields: [],
  };

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
      queryUrl.searchParams.append("name", groupName);

      try {
        // First request to check if the group exists
        const existingGroup = await wretch(queryUrl.toString())
          .auth(`Bearer ${token}`)
          .get()
          .json<{ id: number; name: string }>();

        groupId = existingGroup.id;
      } catch (error: any) {
        if (error.status === 404) {
          // Group does not exist, create it
          const createdGroup = await wretch(`${BASE_URL}/api/groups/`)
            .auth(`Bearer ${token}`)
            .post({ name: groupName })
            .json<{ id: number; name: string }>();

          groupId = createdGroup.id;
        } else {
          throw error;
        }
      }

      // Second request to add the group to the event
      await wretch(`${BASE_URL}/api/events/${eventId}/add-group-to-event/`)
        .auth(`Bearer ${token}`)
        .post({ group_id: groupId });

      setIsAddingGroup(false);
      mutateEvent(); // Refresh the event data to include the new group
      setSnackbarMessage("Group added successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error adding group to event:", error);
      setSnackbarMessage("Failed to add group.");
      setSnackbarSeverity("error");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    const token = await getToken("access");

    try {
      await wretch(`${BASE_URL}/api/events/${eventId}/remove-group-from-event/`)
        .auth(`Bearer ${token}`)
        .post({ group_id: groupId });

      mutateEvent(); // Refresh the event data to remove the deleted group
      setSnackbarMessage("Group removed successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error removing group from event:", error);
      setSnackbarMessage("Failed to remove group.");
      setSnackbarSeverity("error");
    }
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
        <GroupList
          groups={eventGroups}
          onEditGroup={handleGroupEdit}
          onDeleteGroup={handleDeleteGroup}
        />
      </Box>
      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetailPage;
