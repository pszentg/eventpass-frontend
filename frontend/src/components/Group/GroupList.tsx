import styles from "./Group.module.css";

interface Group {
  id: number;
  name: string;
}

interface GroupListProps {
  groups: Group[];
  onEditGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onEditGroup }) => {
  return (
    <ul className={styles.list}>
      {groups.map((group) => (
        <li key={group.id} className={styles.item}>
          <span className={styles.name}>{group.name}</span>
          <button
            className={styles.button}
            onClick={() => onEditGroup(group.id)}
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
