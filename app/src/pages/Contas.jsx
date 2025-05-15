import { useEffect, useState } from 'react';
import { createBill, getBills } from '../services/billsService';
import { createCategory, getCategories } from '../services/categoryService';

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [recorrente, setRecorrente] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  // Estados para filtro de datas
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');

  // Contas filtradas (após filtro de datas)
  const [contasFiltradas, setContasFiltradas] = useState([]);

  const carregarContas = async () => {
    try {
      const data = await getBills();
      setContas(data);
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
    carregarContas();
    carregarCategorias();
  }, []);

  // Filtra as contas toda vez que mudar contas ou o filtro de datas
  useEffect(() => {
    let filtradas = contas;

    if (dataDe) {
      filtradas = filtradas.filter(conta => conta.nextPaymentDate >= dataDe);
    }
    if (dataAte) {
      filtradas = filtradas.filter(conta => conta.nextPaymentDate <= dataAte);
    }

    setContasFiltradas(filtradas);
  }, [contas, dataDe, dataAte]);

  const salvarConta = async () => {
    if (!nome || !valor || !nextPaymentDate || !categoriaSelecionada) {
      alert('Preencha todos os campos obrigatórios.');
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
      document.getElementById('modal_criar_tipo_conta').close();
      resetarFormulario();
    } catch (error) {
      console.error("Erro ao criar conta:", error);
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
      alert('Informe o nome da categoria.');
      return;
    }

    try {
      await createCategory({ name: novaCategoria });
      await carregarCategorias();
      setNovaCategoria('');
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Contas</h1>

      {/* Filtros de Data */}
      <div className="flex gap-4 mb-4 items-end">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Data De</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={dataDe}
            onChange={(e) => setDataDe(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Data Até</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={dataAte}
            onChange={(e) => setDataAte(e.target.value)}
          />
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setDataDe('');
            setDataAte('');
          }}
        >
          Limpar filtro
        </button>
        <button className="btn btn-primary" onClick={() => document.getElementById('modal_criar_tipo_conta').showModal()}>
          Cadastrar conta
        </button>
      </div>
      <dialog id="modal_criar_tipo_conta" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cadastrar conta</h3>

          <div className="form-control mt-4">
            <legend>Nome da Conta</legend>
            <input
              type="text"
              placeholder="Ex: Netflix"
              className="input input-bordered"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="form-control mt-2">
            <legend>Valor</legend>
            <input
              type="number"
              placeholder="10.99"
              className="input input-bordered"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <div className="form-control mt-2">
            <legend>Descrição</legend>
            <input
              type="text"
              placeholder="Ex: Streaming"
              className="input input-bordered"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="form-control mt-2">
            <legend>Data da Primeira Parcela</legend>
            <input
              type="date"
              className="input input-bordered"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
            />
          </div>
          <fieldset className="flex items-center gap-2 p-4 bg-base-100 rounded-box w-fit">
            <input
              type="checkbox"
              className="checkbox"
              checked={recorrente}
              onChange={(e) => setRecorrente(e.target.checked)}
            />
            <label className="label-text">Recorrente?</label>
          </fieldset>

          <div className="form-control mt-2">
            <legend>Categoria</legend>
            <select
              className="select select-bordered"
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-control mt-4">
            <legend>Nova Categoria</legend>
            <input
              type="text"
              placeholder="Ex: Lazer"
              className="input input-bordered"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <button className="btn btn-secondary mt-2" onClick={criarNovaCategoria}>Criar nova categoria</button>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button type="button" className="btn mr-3" onClick={salvarConta}>Salvar</button>
              <button className="btn">Fechar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto mt-8">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data Próx. Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contasFiltradas.map((conta) => (
              <tr key={conta._id}>
                <td>{conta.name}</td>
                <td>R$ {conta.value.toFixed(2)}</td>
                <td>{conta.category?.name || 'Sem categoria'}</td>
                <td>{conta.nextPaymentDate}</td>
                <td>
                  <button className="btn btn-ghost btn-xs">Editar</button>
                  <button className="btn btn-ghost btn-xs text-error">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contas;
