import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RepeatIcon from '@mui/icons-material/Repeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDate } from '@shared/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getRecurrenceLabel = (type) => {
  const labels = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    yearly: 'Anual'
  };
  return labels[type] || type;
};

const Table = ({ contas, onEditar, onExcluir, onProcessarPagamento }) => {
  const contasOrdenadas = [...contas].sort(
    (a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate)
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <MuiTable sx={{ minWidth: 650 }} aria-label="Tabela de contas">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Nome</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Valor</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Categoria</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Próx. Vencimento</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contasOrdenadas.map((conta) => (
            <TableRow
              key={conta._id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {conta.name}
                  {conta.isRecurring && (
                    <Tooltip title="Conta Recorrente">
                      <RepeatIcon color="primary" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>{formatCurrency(conta.value)}</TableCell>
              <TableCell>
                {conta.category?.name ? (
                  <Chip
                    label={conta.category.name}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Chip label="Sem categoria" color="default" size="small" />
                )}
              </TableCell>
              <TableCell>{formatDate(conta.nextPaymentDate)}</TableCell>
              <TableCell>
                {conta.isRecurring ? (
                  <Tooltip title={conta.recurrenceType === 'monthly' ? `Todo dia ${conta.recurrenceDay}` : ''}>
                    <Chip
                      label={getRecurrenceLabel(conta.recurrenceType)}
                      color="primary"
                      size="small"
                    />
                  </Tooltip>
                ) : (
                  <Chip label="Única" size="small" />
                )}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {conta.isRecurring && onProcessarPagamento && (
                    <Tooltip title="Marcar como pago">
                      <IconButton
                        color="success"
                        onClick={() => onProcessarPagamento(conta)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => onEditar(conta)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton color="error" onClick={() => onExcluir(conta)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {contas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                Nenhuma conta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
