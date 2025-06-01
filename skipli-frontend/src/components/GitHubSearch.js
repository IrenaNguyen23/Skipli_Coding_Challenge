import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
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
  IconButton,
  Pagination,
  MenuItem,
  Select,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import { getUserProfile, likeGithubUser, searchGithubUsers } from "../api/api";

export default function GitHubSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [githubUsers, setGithubUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [perPage, setPerPage] = useState(Number(searchParams.get("per_page")) || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [likedUsers, setLikedUsers] = useState(new Set());

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      getUserProfile(email)
        .then((response) => {
          const likedIds = new Set(response.favorite_github_users.map((user) => user.id));
          setLikedUsers(likedIds);
        })
        .catch((err) => console.error("Error fetching liked users:", err));
    }

    if (searchParams.get("q")) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const response = await searchGithubUsers(searchQuery, page, perPage);
      setGithubUsers(response);
      const totalCount = response.total_count || 0;
      setTotalPages(Math.ceil(Math.min(totalCount, 1000) / perPage));
      setSearchParams({ q: searchQuery, page, per_page: perPage });
      setError("");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (githubUserId) => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("Please verify your email first");
      return;
    }

    try {
      await likeGithubUser(email, githubUserId);
      setLikedUsers((prev) => new Set([...prev, githubUserId]));
      setError("");
    } catch (err) {
      setError(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setSearchParams({ q: searchQuery, page: value, per_page: perPage });
  };

  const handlePerPageChange = (event) => {
    const newPerPage = event.target.value;
    setPerPage(newPerPage);
    setPage(1);
    setSearchParams({ q: searchQuery, page: 1, per_page: newPerPage });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Search GitHub Users
        </Typography>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          label="Enter username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSearch}
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Search
        </Button>
      </Grid>
      <Grid item xs={12}>
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
                <TableCell>Like</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {githubUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Link to={`/github-user/${user.id}`}>{user.login}</Link>
                  </TableCell>
                  <TableCell>
                    <img src={user.avatar_url} alt={user.login} width={40} />
                  </TableCell>
                  <TableCell>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      {user.html_url}
                    </a>
                  </TableCell>
                  <TableCell>{user.public_repos || "N/A"}</TableCell>
                  <TableCell>{user.followers || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleLike(user.id)} disabled={likedUsers.has(user.id)}>
                      {likedUsers.has(user.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select value={perPage} onChange={handlePerPageChange} size="small">
          <MenuItem value={10}>10 per page</MenuItem>
          <MenuItem value={20}>20 per page</MenuItem>
          <MenuItem value={50}>50 per page</MenuItem>
        </Select>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Grid>
    </Grid>
  );
}