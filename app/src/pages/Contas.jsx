import { useEffect, useState } from 'react';
import { createBill, getBills } from '../services/billsService';
import { createCategory, getCategories } from '../services/categoryService';
import Table from '../components/Table';

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Alert,
} from '@mui/material';

const Contas = () => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [recorrente, setRecorrente] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  const dateNow = new Date().toISOString().split('T')[0];
  const [dataDe, setDataDe] = useState(dateNow);
  const [dataAte, setDataAte] = useState(dateNow);

  const [contasFiltradas, setContasFiltradas] = useState([]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info');

  const mostrarErro = (message, severity = 'info') => {
    setToastMsg(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const carregarContas = async () => {
    try {
      const data = await getBills();
      setContasFiltradas(data);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    }
  };

  const carregarCategorias = async () => {
    try {
      const data = await getCategories();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const buscarContasFiltradas = async () => {
    try {
      const todasContas = await getBills();
      let filtradas = todasContas;

      if (dataDe) {
        filtradas = filtradas.filter(conta => conta.nextPaymentDate >= dataDe);
      }
      if (dataAte) {
        filtradas = filtradas.filter(conta => conta.nextPaymentDate <= dataAte);
      }

      setContasFiltradas(filtradas);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  const salvarConta = async () => {
    if (!nome || !valor || !nextPaymentDate || !categoriaSelecionada) {
      mostrarErro("Preencha os campos obrigatórios!", "error");
      return;
    }

    const novaConta = {
      name: nome,
      value: parseFloat(valor),
      installments: 1,
      installmentsPayed: 0,
      isRecurring: recorrente,
      nextPaymentDate,
      description: descricao,
      category: categoriaSelecionada,
    };

    try {
      await createBill(novaConta);
      await carregarContas();
      setMostrarModal(false);
      resetarFormulario();
      mostrarErro('Conta cadastrada com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      mostrarErro('Erro ao criar conta.', 'error');
    }
  };

  const resetarFormulario = () => {
    setNome('');
    setValor('');
    setDescricao('');
    setNextPaymentDate('');
    setRecorrente(false);
    setCategoriaSelecionada('');
  };

  const criarNovaCategoria = async () => {
    if (!novaCategoria.trim()) {
      mostrarErro('Informe o nome da categoria.', 'warning');
      return;
    }

    try {
      await createCategory({ name: novaCategoria });
      await carregarCategorias();
      setNovaCategoria('');
      mostrarErro('Categoria criada com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      mostrarErro('Erro ao criar categoria.', 'error');
    }
  };

  return (
    <Box p={4}>
      <Box mb={4} display="flex" gap={2} alignItems="flex-end">
        <TextField
          label="Data De"
          type="date"
          value={dataDe}
          onChange={(e) => setDataDe(e.target.value)}
        />
        <TextField
          label="Data Até"
          type="date"
          value={dataAte}
          onChange={(e) => setDataAte(e.target.value)}
        />
        <Button variant="contained" onClick={buscarContasFiltradas}>
          Buscar
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setDataDe(dateNow);
            setDataAte(dateNow);
            setContasFiltradas([]);
          }}
        >
          Limpar filtro
        </Button>
        <Button variant="contained" color="primary" onClick={() => setMostrarModal(true)}>
          Cadastrar conta
        </Button>
      </Box>

      <Dialog open={mostrarModal} onClose={() => setMostrarModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cadastrar conta</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nome da Conta"
              placeholder="Ex: Netflix"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
            />
            <TextField
              label="Valor"
              type="number"
              placeholder="10.99"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              fullWidth
            />
            <TextField
              label="Descrição"
              placeholder="Ex: Streaming"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data da Primeira Parcela"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={recorrente}
                  onChange={(e) => setRecorrente(e.target.checked)}
                />
              }
              label="Recorrente?"
            />
            <FormControl fullWidth>
              <InputLabel id="categoria-label">Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoriaSelecionada}
                label="Categoria"
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecione uma categoria</em>
                </MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2}>
              <TextField
                label="Nova Categoria"
                placeholder="Ex: Lazer"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                fullWidth
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={criarNovaCategoria}
                sx={{ mt: 1 }}
              >
                Criar nova categoria
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={salvarConta} variant="contained" color="primary">
            Salvar
          </Button>
          <Button onClick={() => setMostrarModal(false)} variant="outlined">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Table
        contas={contasFiltradas}
        onEditar={(conta) => console.log('Editar:', conta)}
        onExcluir={(conta) => console.log('Excluir:', conta)}
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contas;
