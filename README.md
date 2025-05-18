# 💸 Finança Fácil

**Aplicativo de controle de finanças pessoais** – *Em desenvolvimento* 🚧

---

## 🧰 Tecnologias Utilizadas

Este projeto é um **monorepo** com as seguintes tecnologias:

- 🔐 **Login:** Firebase  
- 🎨 **Frontend:** React + MUI  
- 🚀 **Backend:** Node.js + Express + Swagger (/api/docs)
- 🗄️ **Banco de Dados:** MongoDB (MongoDB Atlas)

---

## 🛠️ Como rodar o projeto

> ⚠️ No momento, o projeto está preparado apenas para rodar em ambiente local. Futuramente será feito o deploy na **Google Cloud Platform (GCP)**.

---

### 1. Instalação de dependências

Na raiz do projeto, execute:

```bash
npm install
```

Como se trata de um monorepo, isso instalará as dependências tanto do frontend quanto do backend.

---

### 2. Configuração do Frontend

Crie um arquivo `.env.development` dentro da pasta `client/` com as suas credenciais do Firebase. Exemplo:

```env
VITE_FIREBASE_API_KEY=xxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxx
VITE_FIREBASE_PROJECT_ID=xxxxxxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxxxxxx
```

---

### 3. Configuração do Backend

Crie um arquivo `.env` dentro da pasta `server/` com as variáveis de ambiente necessárias para conectar ao MongoDB. Exemplo:

```env
MONGO_URI=xxxx
FIREBASE_PROJECT_ID=xxxx
FIREBASE_CLIENT_EMAIL=xxxx
FIREBASE_PRIVATE_KEY=xxxx
FIREBASE_SERVICE_ACCOUNT_BASE64=xxxx
```

> 💡 Recomenda-se utilizar o [MongoDB Atlas](https://www.mongodb.com/atlas) para facilitar o acesso ao banco de dados.

---

### 4. Populando o banco com dados de exemplo (opcional)

Você pode rodar um comando (na raiz do projeto, ou direto no back) para inserir alguns registros iniciais no banco:

```bash
npm run seed
```

---

## 📌 Observações

- O projeto ainda está em desenvolvimento. Algumas funcionalidades podem não estar disponíveis ou estáveis.
- Outro detalhe é que o front-end tem apenas uma estrutura inicial que deve ser desconsiderada, pois estou focando no back-end do projeto nesse momento.
- Em breve será adicionado o deploy para produção via GCP.

---

## ✨ Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
