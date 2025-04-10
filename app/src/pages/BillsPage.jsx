import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getBills, createBill, deleteBill } from '../services/billService';
import { formatterAmount, formatDateToPtBr } from "../utils/formatters";
import ptBR from 'date-fns/locale/pt-BR';

export default function Bills() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    value: 0,
    installments: 1,
    nextPaymentDate: new Date(),
    isRecurring: false,
    description: ''
  });

  const columns = [
    { field: 'name', headerName: 'Nome', width: 200 },
    {
      field: 'value',
      headerName: 'Valor (R$)',
      width: 130,
      renderCell: (params) => formatterAmount(params.value),
    },  
    {
      field: 'nextPaymentDate',
      headerName: 'Próximo Pagamento',
      width: 180,
      renderCell: (params) => formatDateToPtBr(params.value),
    },
    {
      field: 'isRecurring',
      headerName: 'Recorrente?',
      width: 120,
      type: 'boolean',
    },
    {
      field: 'description',
      headerName: 'Descrição',
      width: 120
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton 
          color="error" 
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(params.row._id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBill({
      ...newBill,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date) => {
    setNewBill({
      ...newBill,
      nextPaymentDate: date
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(newBill)
      await createBill(newBill);
      handleClose();
      handleGetBills();
      setNewBill({
        name: '',
        value: '',
        installments: 1,
        nextPaymentDate: new Date(),
        isRecurring: false,
        description: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar conta:', error);
      setError('Não foi possível cadastrar a conta. Tente novamente.');
    }
  };

  const handleGetBills = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getBills();
      const billsWithId = data.map((bill) => ({
        ...bill,
        id: bill._id,
      }));
      setRows(billsWithId);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      setError('Não foi possível carregar as contas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      setLoading(true);
      try {
        await deleteBill(id);
        handleGetBills();
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        setError('Não foi possível excluir a conta. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Grid mr={2} >
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="De:"
                  value={newBill.nextPaymentDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, margin: 'dense', size: 'small' } }}
                  
                />
            </LocalizationProvider>
        </Grid>
        <Grid mr={2} >
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Até:"
                  value={newBill.nextPaymentDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, margin: 'dense', size: 'small' } }}
                />
            </LocalizationProvider>
        </Grid>
        <Button 
          variant="contained" 
          onClick={handleGetBills} 
          disabled={loading}
        >
          Buscar contas
        </Button>
        <Button 
          variant="contained" 
          onClick={handleOpen} 
          disabled={loading}
          sx={{ ml: 2 }}
        >
          Cadastrar Contas
        </Button>
        {loading && (
          <CircularProgress size={24} sx={{ ml: 2 }} />
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
  
      <Paper sx={{ height: 500, width: '100%', p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          loading={loading}
          sx={{ border: 0 }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Cadastrar Nova Conta</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nome"
                value={newBill.name}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="value"
                label="Valor (R$)"
                type="number"
                value={newBill.value}
                onChange={handleInputChange}
                fullWidth
                required
                margin="dense"
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="installments"
                label="Quantidade de Parcelas"
                type="number"
                value={newBill.installments}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Próxima Data de Pagamento"
                  value={newBill.nextPaymentDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newBill.isRecurring}
                    onChange={handleInputChange}
                    name="isRecurring"
                    color="primary"
                  />
                }
                label="Conta Recorrente"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descrição"
                value={newBill.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}