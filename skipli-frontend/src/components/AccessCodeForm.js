import { useState } from "react";
import { TextField, Button, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createAccessCode, validateAccessCode } from "../api/api";
export default function AccessCodeForm() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCreateAccessCode = async () => {
    if (!isValidEmail(email)) {
      setError("Invalid email (e.g., user@example.com)");
      setSuccess("");
      return;
    }

    setLoading(true);
    try {
      await createAccessCode(email);
      setError("");
      setSuccess("Access code sent to your email. Check your inbox or spam folder.");
    } catch (err) {
      setError(err);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateAccessCode = async () => {
    if (!accessCode || accessCode.length !== 6 || !/^\d{6}$/.test(accessCode)) {
      setError("Access code must be 6 digits");
      setSuccess("");
      return;
    }

    setLoading(true);
    try {
      await validateAccessCode(email, accessCode);
      localStorage.setItem("userEmail", email);
      setError("");
      setSuccess("Verification successful! Redirecting to search...");
      setTimeout(() => navigate("/search"), 1000);
    } catch (err) {
      setError(err);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ maxWidth: 400, margin: "auto" }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom align="center">
          Email Verification
        </Typography>
      </Grid>
      {success && (
        <Grid item xs={12}>
          <Alert severity="success">{success}</Alert>
        </Grid>
      )}
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleCreateAccessCode}
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Send Access Code
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Access Code (6 digits)"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleValidateAccessCode}
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Verify
        </Button>
      </Grid>
    </Grid>
  );
}