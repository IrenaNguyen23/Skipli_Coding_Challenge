import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Container, AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import GitHubUser from "./pages/GitHubUser";
import theme from "./theme";
import "./App.css";

function NavBar() {
  const location = useLocation();
  const email = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Skipli App
        </Typography>
        <Button color="inherit" component={Link} to="/search">
          Search
        </Button>
        <IconButton color="inherit" component={Link} to={`/profile/${encodeURIComponent(email || "")}`}>
          <AccountCircle />
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Container maxWidth="md" className="app-container">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:email" element={<Profile />} />
            <Route path="/github-user/:id" element={<GitHubUser />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}