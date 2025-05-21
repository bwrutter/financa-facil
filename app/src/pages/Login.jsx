import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Stack,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';

const Login = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/bills');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
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
              {/* Logo ou ícone, opcional */}
              {/* <YourLogo sx={{ fontSize: 60, color: 'primary.main' }} /> */}

              <Typography variant="h3" fontWeight="bold" color="text.primary">
                Finança Fácil
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Gerencie suas finanças de forma simples e eficiente
              </Typography>

              <Button
                onClick={handleLogin}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  ':hover': {
                    boxShadow: 6,
                  },
                }}
              >
                {loading ? 'Entrando...' : 'Entrar com Google'}
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
