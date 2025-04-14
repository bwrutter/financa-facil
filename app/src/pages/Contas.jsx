import { useState } from 'react';

const Contas = () => {
  const [contas, setContas] = useState([
    { id: 1, nome: 'Netflix', saldo: 5000.00, tipo: 'Bancária' },
    { id: 2, nome: 'Carteira', saldo: 500.00, tipo: 'Dinheiro' },
  ]);

  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  const [tipo, setTipo] = useState('Bancária');

  const adicionarConta = () => {
    const novaConta = {
      id: Date.now(),
      nome,
      saldo: parseFloat(saldo),
      tipo,
    };

    setContas([...contas, novaConta]);

    setNome('');
    setSaldo('');
    setTipo('Bancária');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Contas</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Nova Conta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome da Conta</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Netflix"
                className="input input-bordered"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Saldo Inicial</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tipo</span>
              </label>
              <select
                className="select select-bordered"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option>Alimentação</option>
                <option>Combustível</option>
                <option>Outros</option>
              </select>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={adicionarConta}>
              Adicionar Conta
            </button>
          </div>
        </div>
      </div>

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
                <td>R$ {conta.saldo.toFixed(2)}</td>
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
