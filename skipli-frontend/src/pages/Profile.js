import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

import axios from "axios";
import { getUserProfile } from "../api/api";

export default function Profile() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("Please verify your email first");
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await getUserProfile(email);
        setFavoriteUsers(response.favorite_github_users);
        setError("");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [email]);

  if (!email) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error} <Button onClick={() => navigate("/")}>Go to Auth</Button>
      </Alert>
    );
  }

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Profile: {email}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Liked GitHub Users
      </Typography>
      {favoriteUsers.length === 0 ? (
        <Typography>No users liked yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Profile URL</TableCell>
                <TableCell>Repositories</TableCell>
                <TableCell>Followers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favoriteUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>
                    <img src={user.avatar_url} alt={user.login} width={40} />
                  </TableCell>
                  <TableCell>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      {user.html_url}
                    </a>
                  </TableCell>
                  <TableCell>{user.public_repos}</TableCell>
                  <TableCell>{user.followers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}