import { useState } from "react";
import styles from "./Group.module.css";

interface AddGroupFormProps {
  onAddGroup: (groupName: string) => void;
  onCancel: () => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({
  onAddGroup,
  onCancel,
}) => {
  const [groupName, setGroupName] = useState("");

  const handleAddGroup = () => {
    onAddGroup(groupName);
    setGroupName("");
  };

  return (
    <div className={styles.addContainer}>
      <input
        className={styles.addInput}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <button
        className={`${styles.button} ${styles.addButton}`}
        onClick={handleAddGroup}
      >
        Save
      </button>
      <button
        className={`${styles.button} ${styles.addButton}`}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default AddGroupForm;
