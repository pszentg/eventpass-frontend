import React, { useState, useEffect } from "react";
import wretch from "wretch";
import Cookies from "js-cookie";
import styles from "./ManageGroups.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");

  const fetchGroups = async () => {
    try {
      const token = Cookies.get("access");
      const response = await wretch(`${BASE_URL}/api/groups`)
        .auth(`Bearer ${token}`)
        .get()
        .json();
      setGroups(response);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const token = Cookies.get("access");
      await wretch(`${BASE_URL}/api/groups`)
        .auth(`Bearer ${token}`)
        .post({ name: groupName })
        .res();
      setGroupName("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleUpdateGroup = async (id) => {
    try {
      const token = Cookies.get("access");
      await wretch(`${BASE_URL}/api/groups/${id}`)
        .auth(`Bearer ${token}`)
        .put({ name: editGroupName })
        .res();
      setEditGroupId(null);
      setEditGroupName("");
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const token = Cookies.get("access");
      await wretch(`${BASE_URL}/api/groups/${id}`)
        .auth(`Bearer ${token}`)
        .delete()
        .res();
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Groups</h2>
      <div className={styles.createGroup}>
        <input
          type="text"
          className={styles.textInput}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        <button onClick={handleCreateGroup} className={styles.button}>
          Create Group
        </button>
      </div>
      <div className={styles.groupsList}>
        {groups.map((group) => (
          <div key={group.id} className={styles.groupItem}>
            {editGroupId === group.id ? (
              <>
                <input
                  type="text"
                  className={styles.textInput}
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Edit Group Name"
                />
                <button
                  onClick={() => handleUpdateGroup(group.id)}
                  className={styles.button}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditGroupId(null)}
                  className={styles.button}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{group.name}</span>
                <button
                  onClick={() => {
                    setEditGroupId(group.id);
                    setEditGroupName(group.name);
                  }}
                  className={styles.button}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className={styles.button}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGroups;
