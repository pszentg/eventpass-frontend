import { List, ListItem, ListItemText, Button, Box } from "@mui/material";

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
    <List>
      {groups.map((group) => (
        <ListItem
          key={group.id}
          secondaryAction={
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onEditGroup(group.id)}
            >
              Edit
            </Button>
          }
        >
          <ListItemText primary={group.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default GroupList;
