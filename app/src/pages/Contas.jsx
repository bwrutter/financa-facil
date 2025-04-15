import { useState } from 'react';

const Contas = () => {
  const [contas, setContas] = useState([
    { id: 1, nome: 'Netflix', valor: 5000.00, tipo: 'Lazer' }
  ]);

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoContaCriar, setTipoContaCriar] = useState('');
  const [valor, setValor] = useState('');
  const [recorrente, setRecorrente] = useState(false);
  //const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState('');
  //const [dataUltimaParcela, setDataUltimaParcela] = useState('');
  //const [descricao, setDescricao] = useState('');

  const adicionarConta = () => {
    const novaConta = {
      id: Date.now(),
      nome,
      valor: parseFloat(valor),
      tipo,
    };

    if (!nome || !valor || !tipo) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setContas([...contas, novaConta]);

    setNome('');
    setValor('');
    setTipo('');
  };

  const criarTipoConta = () => {
    if (!tipoContaCriar) {
      alert('Por favor, preencha o nome do tipo de conta.');
      return;
    }

    setTipo(tipoContaCriar);
    setTipoContaCriar('');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Contas</h1>
          <div className="card-actions justify-end mt-4 flex gap-4">
            <button className="btn btn-primary" onClick={()=>document.getElementById('modal_criar_tipo_conta').showModal()}>
              Cadastrar contas
            </button>
            <button className="btn btn-primary" onClick={adicionarConta}>
              Adicionar Conta
            </button>
          </div>
 
       <dialog id="modal_criar_tipo_conta" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cadastrar contas</h3>
            <div className="form-control mt-4">
              <legend>Nome da Conta</legend>
              <input
                type="text"
                placeholder="Netflix"
                className="input input-bordered"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <legend>Valor</legend>
              <input
                type="number"
                placeholder="10,99"
                className="input input-bordered"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <legend>Descrição</legend>
              <input
                type="text"
                placeholder="Streaming"
                className="input input-bordered"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <legend>Data da primeira parcela</legend>
              <input
                type="date"
                placeholder="Ex: Netflix"
                className="input input-bordered"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
                <div className="form-control mt-2">
                  <legend>Data da última parcela</legend>
                  <input
                    disabled={!recorrente}
                    type="date"
                    placeholder="Ex: Netflix"
                    className="input input-bordered"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <fieldset className="flex items-center gap-2 p-4 bg-base-100 rounded-box w-fit">
                  <input type="checkbox" defaultChecked className="checkbox" onChange={(e) => setRecorrente(e.target.checked)}/>
                  <label className="label-text">Recorrente?</label>
                </fieldset>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-3" onClick={criarTipoConta}>Salvar</button>
              <button className="btn">Fechar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto mt-8">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Saldo</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.nome}</td>
                <td>R$ {conta.valor.toFixed(2)}</td>
                <td>{conta.tipo}</td>
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
