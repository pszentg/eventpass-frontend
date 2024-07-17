"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState, useContext } from "react";
import useSWR from "swr";
import wretch from "wretch";
import Link from "next/link";
import UserContext from "@/context/UserContext";
import EventForm, { NewEvent } from "@/components/Event/FormBuilder/EventForm";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Add,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

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
  const userContext = useContext(UserContext);
  const {
    data: events,
    error,
    mutate,
  } = useSWR<Event[]>("/api/events/", fetcher);
  const [showForm, setShowForm] = useState(false);

  if (error)
    return (
      <Container>
        <Typography color="error">Failed to load events</Typography>
      </Container>
    );
  if (!events)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  const createEvent = async (newEvent: NewEvent) => {
    if (!userContext?.user) return;
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/`)
      .auth(`Bearer ${token}`)
      .post({ ...newEvent, client: userContext.user.id })
      .res();
    setShowForm(false);
    mutate();
  };

  const updateEvent = async (event: Event) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${event.id}/`)
      .auth(`Bearer ${token}`)
      .put(event)
      .res();
    mutate();
  };

  const deleteEvent = async (id: number) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/events/${id}/`)
      .auth(`Bearer ${token}`)
      .delete()
      .res();
    mutate();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setShowForm(!showForm)}
      >
        Add Event
      </Button>
      {showForm && (
        <EventForm
          createEvent={createEvent}
          onCancel={() => setShowForm(false)}
        />
      )}
      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText primary={event.name} />
            <Link href={`/admin/events/${event.id}`} passHref>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                style={{ marginRight: 8 }}
              >
                Edit
              </Button>
            </Link>
            <IconButton color="secondary" onClick={() => deleteEvent(event.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EventsPage;
