import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import RecurringBillsList from '../components/RecurringBillsList';
import RecurringBillForm from '../components/RecurringBillForm';
import { billsService } from '../services/billsService';

const RecurringBillsPage = () => {
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

    const handleCreateBill = async (formData) => {
        try {
            await billsService.create(formData);
            setIsDialogOpen(false);
            showMessage('Conta recorrente criada com sucesso', 'success');
            // A lista será atualizada automaticamente pelo useEffect no RecurringBillsList
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar conta recorrente';
            showMessage(errorMessage, 'error');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Gerenciar Contas Recorrentes
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Nova Conta
                    </Button>
                </Box>

                <Paper sx={{ p: 2 }}>
                    <RecurringBillsList />
                </Paper>

                <Dialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Nova Conta Recorrente
                    </DialogTitle>
                    <DialogContent>
                        <RecurringBillForm
                            onSubmit={handleCreateBill}
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
        </Container>
    );
};

export default RecurringBillsPage; 