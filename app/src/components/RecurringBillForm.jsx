import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Button,
    Typography,
    Alert,
} from '@mui/material';
import { billsService } from '../services/billsService';

const RecurringBillForm = ({ bill, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        isRecurring: false,
        recurrenceType: 'monthly',
        recurrenceDay: 1,
        description: '',
        category: '',
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (bill) {
            setFormData({
                name: bill.name || '',
                value: bill.value || '',
                isRecurring: bill.isRecurring || false,
                recurrenceType: bill.recurrenceType || 'monthly',
                recurrenceDay: bill.recurrenceDay || 1,
                description: bill.description || '',
                category: bill.category || '',
            });
        }
    }, [bill]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'isRecurring' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (formData.isRecurring && formData.recurrenceType === 'monthly' &&
                (formData.recurrenceDay < 1 || formData.recurrenceDay > 31)) {
                throw new Error('Dia do mês deve estar entre 1 e 31');
            }

            await onSubmit(formData);
        } catch (err) {
            setError(err.message || 'Erro ao salvar conta');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
            />

            <TextField
                fullWidth
                label="Valor"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={formData.isRecurring}
                        onChange={handleChange}
                        name="isRecurring"
                    />
                }
                label="Conta Recorrente"
                sx={{ my: 2 }}
            />

            {formData.isRecurring && (
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Recorrência</InputLabel>
                        <Select
                            name="recurrenceType"
                            value={formData.recurrenceType}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="daily">Diária</MenuItem>
                            <MenuItem value="weekly">Semanal</MenuItem>
                            <MenuItem value="monthly">Mensal</MenuItem>
                            <MenuItem value="yearly">Anual</MenuItem>
                        </Select>
                    </FormControl>

                    {formData.recurrenceType === 'monthly' && (
                        <TextField
                            fullWidth
                            label="Dia do Mês"
                            name="recurrenceDay"
                            type="number"
                            value={formData.recurrenceDay}
                            onChange={handleChange}
                            required
                            margin="normal"
                            inputProps={{ min: 1, max: 31 }}
                        />
                    )}
                </>
            )}

            <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {bill ? 'Atualizar' : 'Criar'} Conta
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={onCancel}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default RecurringBillForm; 