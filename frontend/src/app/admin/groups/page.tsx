"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import {
  Add,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Group = {
  id: number;
  name: string;
};

const GroupsPage = () => {
  const { getToken } = AuthActions();
  const {
    data: groups,
    error,
    mutate,
  } = useSWR<Group[]>("/api/groups/", fetcher);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  if (error)
    return (
      <Container>
        <Typography color="error">Failed to load groups</Typography>
      </Container>
    );
  if (!groups)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  const createGroup = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/groups/`)
      .auth(`Bearer ${token}`)
      .post({ name: newGroupName })
      .res();
    setNewGroupName("");
    mutate(); // Revalidate the data
  };

  const updateGroup = async (group: Group) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/groups/${group.id}/`)
      .auth(`Bearer ${token}`)
      .put(group)
      .res();
    setEditingGroup(null);
    mutate(); // Revalidate the data
  };

  const deleteGroup = async (id: number) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/groups/${id}/`)
      .auth(`Bearer ${token}`)
      .delete()
      .res();
    mutate(); // Revalidate the data
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Groups
      </Typography>
      <List>
        {groups.map((group) => (
          <ListItem
            key={group.id}
            secondaryAction={
              <>
                <Link href={`/admin/groups/${group.id}`} passHref>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton
                  color="secondary"
                  onClick={() => deleteGroup(group.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
      <Box display="flex" alignItems="center" mt={2}>
        <TextField
          variant="outlined"
          label="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={createGroup}
          style={{ marginLeft: 8 }}
        >
          Add Group
        </Button>
      </Box>
    </Container>
  );
};

export default GroupsPage;
