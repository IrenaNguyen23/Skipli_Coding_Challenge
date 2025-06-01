import GitHubSearch from '../components/GitHubSearch';
import { Typography, Box } from '@mui/material';

function Search() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">
        Search GitHub Users
      </Typography>
      <GitHubSearch />
    </Box>
  );
}

export default Search;