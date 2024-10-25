import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to My App
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Your one-stop solution for everything
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={4} key={item}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Feature {item}
                  </Typography>
                  <Typography variant="body2">
                    This is a brief description of Feature {item}. Replace this
                    with actual content about your app's features.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
