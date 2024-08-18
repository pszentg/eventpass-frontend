import React from "react";
import QRCode from "qrcode.react";
import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Ensure this is set in your environment variables
  const qrCodeValue = `${BASE_URL}/users/add_user_to_group/${user.id}`;

  return (
    <Card sx={{ padding: 4, margin: "auto" }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CardHeader title="User Information" />
        <CardContent>
          <Typography variant="body1">
            <strong>Name:</strong> {user.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <QRCode value={qrCodeValue} />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default UserInfo;
