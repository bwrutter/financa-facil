import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { billsService } from '../services/billsService';
import RecurringBillForm from './RecurringBillForm';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

const RecurringBillsList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBill, setEditingBill] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const showMessage = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const loadBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await billsService.getUpcoming(30); // Próximos 30 dias
            setBills(data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar contas recorrentes';
            setError(errorMessage);
            showMessage(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBills();
    }, []);

    const handleEdit = (bill) => {
        setEditingBill(bill);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
            try {
                await billsService.delete(id);
                showMessage('Conta excluída com sucesso', 'success');
                await loadBills();
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || 'Erro ao excluir conta';
                showMessage(errorMessage, 'error');
            }
        }
    };

    const handleProcessPayment = async (id) => {
        try {
            await billsService.processPayment(id);
            showMessage('Pagamento processado com sucesso', 'success');
            await loadBills();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro ao processar pagamento';
            showMessage(errorMessage, 'error');
        }
    };

    const handleSubmitEdit = async (formData) => {
        try {
            await billsService.update(editingBill._id, formData);
            showMessage('Conta atualizada com sucesso', 'success');
            setIsDialogOpen(false);
            setEditingBill(null);
            await loadBills();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro ao atualizar conta';
            showMessage(errorMessage, 'error');
        }
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

    if (loading) return <Typography>Carregando...</Typography>;
    if (error) return (
        <Alert severity="error" sx={{ mb: 2 }}>
            {error}
        </Alert>
    );

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Contas Recorrentes
            </Typography>

            <Stack spacing={2}>
                {bills.map((bill) => (
                    <Card key={bill._id}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6">{bill.name}</Typography>
                                    <Typography color="textSecondary">
                                        Próximo pagamento: {formatDate(bill.nextPaymentDate)}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {formatCurrency(bill.value)}
                                    </Typography>
                                    <Chip
                                        label={getRecurrenceLabel(bill.recurrenceType)}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                    {bill.recurrenceType === 'monthly' && (
                                        <Typography variant="caption" display="block">
                                            Dia {bill.recurrenceDay} de cada mês
                                        </Typography>
                                    )}
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <IconButton
                                        onClick={() => handleProcessPayment(bill._id)}
                                        color="success"
                                        title="Marcar como pago"
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleEdit(bill)}
                                        color="primary"
                                        title="Editar"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(bill._id)}
                                        color="error"
                                        title="Excluir"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Editar Conta Recorrente
                </DialogTitle>
                <DialogContent>
                    <RecurringBillForm
                        bill={editingBill}
                        onSubmit={handleSubmitEdit}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RecurringBillsList; 