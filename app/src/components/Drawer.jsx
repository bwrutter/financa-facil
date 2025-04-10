import * as React from 'react';
import { Link } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import BarChartIcon from '@mui/icons-material/BarChart';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: (
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        Principal
      </Link>
    ),
    icon: <DashboardIcon />,
  },
  {
    segment: 'bills',
    title: (
      <Link to="/bills" style={{ textDecoration: 'none', color: 'inherit' }}>
        Contas a pagar
      </Link>
    ),
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'graphs',
    title: 'Análise',
    icon: <BarChartIcon />,
  },
];

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function Drawer(props) {
  const { window, children } = props;

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={theme}
      window={demoWindow}
      branding={{
        title: 'Finança Fácil',
      }}
    >
      <DashboardLayout>
        <PageContainer>
          {children}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
