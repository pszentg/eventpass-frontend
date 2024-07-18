import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Group {
  id: number;
  name: string;
}

interface GroupListProps {
  groups: Group[];
  onEditGroup: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  onEditGroup,
  onDeleteGroup,
}) => {
  return (
    <List>
      {groups.map((group) => (
        <ListItem key={group.id}>
          <ListItemText primary={group.name} />
          <ListItemSecondaryAction>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onEditGroup(group.id)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeleteGroup(group.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
export default GroupList;
