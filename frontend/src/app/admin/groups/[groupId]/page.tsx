"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "../groups.module.css";
import { AuthActions } from "@/app/auth/utils";
import { fetcher } from "@/app/auth/fetcher";
import { useParams, useRouter } from "next/navigation";

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
  const { data: users, error: usersError } = useSWR<User[]>(
    groupId ? `/api/groups/${groupId}/users` : null,
    fetcher
  );

  useEffect(() => {
    if (group) {
      setGroupName(group.name);
    }
  }, [group]);

  if (groupError)
    return <div className={styles.error}>Failed to load group</div>;
  if (usersError)
    return <div className={styles.error}>Failed to load users</div>;
  if (!group || !users) return <div className={styles.loading}>Loading...</div>;

  const updateGroupName = async () => {
    const token = await getToken("access");
    await wretch(`${BASE_URL}/api/groups/${groupId}/`)
      .auth(`Bearer ${token}`)
      .put({ name: groupName })
      .res();
    setIsEditing(false);
    mutateGroup();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Edit Group</h1>
      <div>
        {isEditing ? (
          <>
            <input
              className={styles.input}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button className={styles.button} onClick={updateGroupName}>
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
            <span className={styles.name}>{group.name}</span>
            <button
              className={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      <h2 className={styles.subheader}>Users in this group</h2>
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.id} className={styles.item}>
            <span className={styles.name}>
              {user.username} ({user.email})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetailPage;
