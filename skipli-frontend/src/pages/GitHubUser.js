import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { getGithubUser, getUserProfile, likeGithubUser } from "../api/api";

export default function GitHubUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getGithubUser(id);
        setUser(userResponse);
        setError("");
        const email = localStorage.getItem("userEmail");
        if (email) {
          const profileResponse = await getUserProfile(email);
          const likedIds = new Set(profileResponse.favorite_github_users.map((u) => u.id));
          setIsLiked(likedIds.has(Number(id)));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleLike = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("Please verify your email first");
      setSuccess("");
      return;
    }

    setLikeLoading(true);
    try {
      await likeGithubUser(email, id);
      setSuccess("Profile liked successfully!");
      setError("");
      setIsLiked(true);
    } catch (err) {
      setError(err);
      setSuccess("");
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
  }

  if (error && !user) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "2rem auto" }}>
      <CardMedia component="img" height="200" image={user.avatar_url} alt={user.login} />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.login}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ID: {user.id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Repositories: {user.public_repos}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Followers: {user.followers}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            View GitHub Profile
          </a>
        </Typography>
        <IconButton onClick={handleLike} disabled={likeLoading || isLiked} sx={{ mt: 2 }}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}