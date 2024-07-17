"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import { AuthActions } from "@/app/auth/utils";
import { fetcher } from "@/app/auth/fetcher";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Edit, Save, Cancel, Delete as DeleteIcon } from "@mui/icons-material";

type Group = {
  id: number;
  name: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const GroupDetailPage = () => {
  const { getToken } = AuthActions();
  const params = useParams();
  const groupId = params.groupId as string;
  const [groupName, setGroupName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: group,
    error: groupError,
    mutate: mutateGroup,
  } = useSWR<Group>(groupId ? `/api/groups/${groupId}/` : null, fetcher);
  const {
    data: users,
    error: usersError,
    mutate: mutateUsers,
  } = useSWR<User[]>(groupId ? `/api/groups/${groupId}/users` : null, fetcher);

  useEffect(() => {
    if (group) {
      setGroupName(group.name);
    }
  }, [group]);

  if (groupError)
    return (
      <Container>
        <Typography color="error">Failed to load group</Typography>
      </Container>
    );
  if (usersError)
    return (
      <Container>
        <Typography color="error">Failed to load users</Typography>
      </Container>
    );
  if (!group || !users)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  const updateGroupName = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/groups/${groupId}/`)
      .auth(`Bearer ${token}`)
      .put({ name: groupName })
      .res();
    setIsEditing(false);
    mutateGroup();
  };

  const deleteUserFromGroup = async (userId: number) => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/users/${userId}/remove-group/${groupId}`)
      .auth(`Bearer ${token}`)
      .get()
      .res();
    mutateUsers();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Group
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        {isEditing ? (
          <>
            <TextField
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <IconButton onClick={updateGroupName} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} color="secondary">
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h6" style={{ marginRight: 8 }}>
              {group.name}
            </Typography>
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <Edit />
            </IconButton>
          </>
        )}
      </Box>
      <Typography variant="h5" gutterBottom>
        Users in this group
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton
                color="secondary"
                onClick={() => deleteUserFromGroup(user.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${user.username} (${user.email})`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default GroupDetailPage;
