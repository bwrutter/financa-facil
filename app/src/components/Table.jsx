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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Table = ({ contas, onEditar, onExcluir }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <MuiTable sx={{ minWidth: 650 }} aria-label="Tabela de contas">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Nome</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Valor</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Categoria</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Data Próx. Pagamento</TableCell>
            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contas.map((conta) => (
            <TableRow
              key={conta._id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{conta.name}</TableCell>
              <TableCell>R$ {conta.value.toFixed(2)}</TableCell>
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
              <TableCell>{conta.nextPaymentDate}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
          {contas.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
