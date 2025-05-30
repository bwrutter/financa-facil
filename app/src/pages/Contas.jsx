import { useEffect, useState } from 'react';
import { createBill, getBills } from '../services/billsService';
import { createCategory, getCategories } from '../services/categoryService';
import Table from '../components/Table';
import FilterListIcon from '@mui/icons-material/FilterList';
import RepeatIcon from '@mui/icons-material/Repeat';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Tooltip,
  Chip,
  Stack,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

const Contas = () => {
  const dateNow = new Date().toISOString().split('T')[0];
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState(dateNow);
  const [recorrente, setRecorrente] = useState(false);
  const [tipoRecorrencia, setTipoRecorrencia] = useState('monthly');
  const [diaRecorrencia, setDiaRecorrencia] = useState(1);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [dataDe, setDataDe] = useState(dateNow);
  const [dataAte, setDataAte] = useState(dateNow);
  const [contasFiltradas, setContasFiltradas] = useState([]);
  const [todasContas, setTodasContas] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info');
  const [filtroTipo, setFiltroTipo] = useState('todas'); // 'todas', 'recorrentes', 'nao-recorrentes'

  const calcularDespesasMesAtual = () => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    return todasContas.reduce((total, conta) => {
      const dataVencimento = new Date(conta.nextPaymentDate);
      if (dataVencimento >= primeiroDiaMes && dataVencimento <= ultimoDiaMes) {
        return total + conta.value;
      }
      return total;
    }, 0);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const mostrarErro = (message, severity = 'info') => {
    setToastMsg(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const carregarContas = async () => {
    try {
      const data = await getBills();
      setTodasContas(data); // Armazena todas as contas
      let contasFiltradas = data;

      // Aplica filtro por tipo de conta
      if (filtroTipo === 'recorrentes') {
        contasFiltradas = data.filter(conta => conta.isRecurring);
      } else if (filtroTipo === 'nao-recorrentes') {
        contasFiltradas = data.filter(conta => !conta.isRecurring);
      }

      setContasFiltradas(contasFiltradas);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      mostrarErro(error.response?.data?.error || 'Erro ao carregar contas', 'error');
    }
  };

  const carregarCategorias = async () => {
    try {
      const data = await getCategories();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      mostrarErro('Erro ao carregar categorias', 'error');
    }
  };

  useEffect(() => {
    carregarCategorias();
    carregarContas();
  }, []);

  useEffect(() => {
    carregarContas();
  }, [filtroTipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !valor || !categoriaSelecionada) {
      mostrarErro('Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    const novaConta = {
      name: nome,
      value: parseFloat(valor),
      description: descricao,
      category: categoriaSelecionada,
      nextPaymentDate,
      isRecurring: recorrente,
      ...(recorrente && {
        recurrenceType: tipoRecorrencia,
        ...(tipoRecorrencia === 'monthly' && { recurrenceDay: parseInt(diaRecorrencia) })
      })
    };

    try {
      await createBill(novaConta);
      setMostrarModal(false);
      limparFormulario();
      carregarContas();
      mostrarErro('Conta criada com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      mostrarErro(error.response?.data?.error || 'Erro ao criar conta', 'error');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setValor('');
    setDescricao('');
    setNextPaymentDate(dateNow);
    setRecorrente(false);
    setTipoRecorrencia('monthly');
    setDiaRecorrencia(1);
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

  const cardsData = [
    {
      title: 'Total Mensal',
      subtitle: '700',
      body: 'Valor total de receitas do mês.',
    },
    {
      title: 'Despesas',
      subtitle: formatarMoeda(calcularDespesasMesAtual()),
      body: 'Valor total das despesas do mês atual.',
    },
    {
      title: 'Saldo',
      subtitle: '950',
      body: 'Diferença entre receitas e despesas.',
    },
  ];

  return (
    <Box p={1}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Contas a Pagar
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {cardsData.map(({ title, subtitle, body }, index) => (
          <Card
            key={index}
            sx={{
              maxWidth: 300,
              maxHeight: 150,
              background: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
              borderRadius: 4,
              boxShadow: 6,
              color: 'white',
              flex: '1 1 300px',
              marginBottom: 5,
            }}
          >
            <CardContent>
              <Typography gutterBottom sx={{ fontSize: 14, opacity: 0.9 }}>
                {title}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  fontSize: 25,
                  opacity: 0.8,
                  mb: 1.5,
                }}
              >
                R$ {subtitle}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                {body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box mb={4}>
        <Stack direction="row" spacing={2} alignItems="flex-end" flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            color={mostrarFiltros ? 'primary' : 'white'}
            startIcon={<FilterListIcon />}
          >
            Filtros
          </Button>

          <ToggleButtonGroup
            value={filtroTipo}
            exclusive
            onChange={(e, newValue) => newValue && setFiltroTipo(newValue)}
            size="small"
          >
            <ToggleButton value="todas">
              Todas
            </ToggleButton>
            <ToggleButton value="recorrentes">
              <Tooltip title="Contas Recorrentes">
                <RepeatIcon sx={{ mr: 1 }} />
              </Tooltip>
              Recorrentes
            </ToggleButton>
            <ToggleButton value="nao-recorrentes">
              Não Recorrentes
            </ToggleButton>
          </ToggleButtonGroup>

          {mostrarFiltros && (
            <>
              <TextField
                label="Data De"
                type="date"
                size="small"
                value={dataDe}
                onChange={(e) => setDataDe(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Data Até"
                type="date"
                size="small"
                value={dataAte}
                onChange={(e) => setDataAte(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}

          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={carregarContas}>
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
              Limpar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMostrarModal(true)}
            >
              Nova Conta
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Table
        contas={contasFiltradas}
        onEditar={(conta) => console.log('Editar:', conta)}
        onExcluir={(conta) => console.log('Excluir:', conta)}
      />

      <Dialog
        open={mostrarModal}
        onClose={() => setMostrarModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nova Conta</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                required
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, mb: 2 }}>
              <TextField
                label="Nova Categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                size="small"
              />
              <Button
                onClick={criarNovaCategoria}
                variant="outlined"
                sx={{ ml: 1 }}
              >
                Adicionar
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Data de Vencimento"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={recorrente}
                  onChange={(e) => setRecorrente(e.target.checked)}
                />
              }
              label="Conta Recorrente"
              sx={{ mt: 2, mb: 1 }}
            />

            {recorrente && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo de Recorrência</InputLabel>
                  <Select
                    value={tipoRecorrencia}
                    onChange={(e) => setTipoRecorrencia(e.target.value)}
                    required
                  >
                    <MenuItem value="daily">Diária</MenuItem>
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="monthly">Mensal</MenuItem>
                    <MenuItem value="yearly">Anual</MenuItem>
                  </Select>
                </FormControl>

                {tipoRecorrencia === 'monthly' && (
                  <TextField
                    fullWidth
                    label="Dia do Mês"
                    type="number"
                    value={diaRecorrencia}
                    onChange={(e) => setDiaRecorrencia(e.target.value)}
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
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              multiline
              rows={2}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
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
