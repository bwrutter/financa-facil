import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Stack,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/contas');
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to top right, #6366f1, #8b5cf6, #ec4899)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              Finança Fácil
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Gerencie suas finanças de forma simples e eficiente
            </Typography>

            <Button
              onClick={loginWithGoogle}
              variant="contained"
              color="error"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: 3,
                ':hover': {
                  boxShadow: 6,
                },
              }}
            >
              Entrar com Google
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
