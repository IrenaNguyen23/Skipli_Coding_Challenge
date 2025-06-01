import AccessCodeForm from '../components/AccessCodeForm';
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Skipli Authentication
      </Typography>
      <AccessCodeForm />
    </Box>
  );
}

export default Home;