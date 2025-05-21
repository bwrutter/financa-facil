import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, AlertTriangle, Clock } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Chip, IconButton, Tooltip
} from '@mui/material';
import { formatCurrency, formatDate, isDateApproaching, isDateOverdue } from '../utils/formatters';
import CategoryBadge from './CategoryBadge';
import EmptyState from './EmptyState';

const MotionTableRow = motion(TableRow);

const BillsTable = ({ bills, onEdit, onDelete }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!bills.length) {
    return (
      <EmptyState
        title="Nenhuma conta encontrada"
        message="Tente ajustar os filtros ou cadastre uma nova conta"
      />
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {['Nome', 'Valor', 'Categoria', 'Próx. Pagamento', 'Recorrente', 'Ações'].map(header => (
              <TableCell
                key={header}
                sx={{ py: 2, px: 3, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {bills.map((bill, index) => (
            <MotionTableRow
              key={bill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredRow(bill.id)}
              onMouseLeave={() => setHoveredRow(null)}
              sx={{
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'default',
              }}
            >
              <TableCell sx={{ py: 2, px: 3, fontWeight: 'medium', color: 'text.primary' }}>
                {bill.name}
              </TableCell>

              <TableCell sx={{ py: 2, px: 3, color: 'text.secondary' }}>
                {formatCurrency(bill.value)}
              </TableCell>

              <TableCell sx={{ py: 2, px: 3 }}>
                <CategoryBadge category={bill.category} animate={hoveredRow === bill.id} />
              </TableCell>

              <TableCell sx={{ py: 2, px: 3 }}>
                {isDateOverdue(bill.nextPayment) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'error.main', fontWeight: 'medium' }}>
                    <AlertTriangle size={16} />
                    {formatDate(bill.nextPayment)}
                  </Box>
                ) : isDateApproaching(bill.nextPayment) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'warning.main', fontWeight: 'medium' }}>
                    <Clock size={16} />
                    {formatDate(bill.nextPayment)}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    {formatDate(bill.nextPayment)}
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={{ py: 2, px: 3 }}>
                {bill.isRecurring ? (
                  <Chip
                    label="Sim"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 'medium', textTransform: 'none' }}
                  />
                ) : (
                  <Chip
                    label="Não"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'medium', textTransform: 'none' }}
                  />
                )}
              </TableCell>

              <TableCell sx={{ py: 2, px: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onEdit(bill)}
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => onDelete(bill)}
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </MotionTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BillsTable;
