"use client";

import { fetcher } from "@/app/auth/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useState } from "react";
import useSWR from "swr";
import wretch from "wretch";
import styles from "./groups.module.css";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

  if (error) return <div>Failed to load groups</div>;
  if (!groups) return <div>Loading...</div>;

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
    <div className={styles.container}>
      <h1>Groups</h1>
      <ul className={styles.list}>
        {groups.map((group) => (
          <li key={group.id} className={styles.item}>
            <span className={styles.name}>{group.name}</span>
            <Link href={`/admin/groups/${group.id}`}>
              <div className={styles.button}>Edit</div>
            </Link>
            <button
              className={styles.button}
              onClick={() => deleteGroup(group.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.addContainer}>
        <input
          className={styles.addInput}
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
          required={true}
        />
        <button className={styles.addButton} onClick={createGroup}>
          Add Group
        </button>
      </div>
    </div>
  );
};

export default GroupsPage;
