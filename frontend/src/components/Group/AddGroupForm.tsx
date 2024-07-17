import { useState } from "react";
import { TextField, Button, Box, Container } from "@mui/material";

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
    <Container>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          variant="outlined"
          label="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
        />
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleAddGroup}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddGroupForm;
