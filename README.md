
# API Cantina ULBRA

API REST desenvolvida em Node.js para gerenciamento de produtos, pedidos e relatórios de vendas da cantina ULBRA.

## Tecnologias utilizadas

- Node.js
- Express
- Knex.js
- SQLite3

## Requisitos

- Node.js instalado
- NPM instalado

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/JorgeGabriel18/cantina-ulbra-api.git
```

2. Entre na pasta do projeto:

```bash
cd cantina-ulbra-api
```

3. Instale as dependências:

```bash
npm install
```

4. Execute as migrations:

```bash
npx knex migrate:latest
```

5. Execute os seeds:

```bash
npx knex seed:run
```

6. Inicie a aplicação:

```bash
npm start
```

A API estará disponível em:

http://localhost:3000

## Estrutura do projeto

```text
cantina-ulbra-api/
├── src/
│   ├── controllers/
│   │   ├── produtosController.js
│   │   ├── pedidosController.js
│   │   └── relatoriosController.js
│   ├── routes/
│   │   ├── produtosRoutes.js
│   │   ├── pedidosRoutes.js
│   │   └── relatoriosRoutes.js
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── connection.js
│   └── server.js
├── knexfile.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Endpoints

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/produtos | Listar produtos |
| GET | /api/produtos/:id | Buscar produto por ID |
| POST | /api/produtos | Cadastrar produto |
| PUT | /api/produtos/:id | Atualizar produto |
| DELETE | /api/produtos/:id | Excluir produto |

Filtros disponíveis:

- `categoria`: filtra pela categoria do produto.
- `ativo`: filtra produtos ativos ou inativos.

Exemplo:

```text
GET /api/produtos?categoria=Lanches
GET /api/produtos?ativo=true
```

Exemplo de cadastro:

```json
{
    "nome": "Refrigerante",
    "categoria": "Bebidas",
    "preco": 5.00,
    "estoque": 30
}
```

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/pedidos | Listar pedidos |
| GET | /api/pedidos/:id | Buscar pedido por ID |
| POST | /api/pedidos | Criar pedido |
| DELETE | /api/pedidos/:id | Excluir pedido |

A listagem utiliza paginação obrigatória com `limit` e `offset`, além do filtro opcional `aluno`.

Exemplo:

```text
GET /api/pedidos?limit=10&offset=0
GET /api/pedidos?limit=10&offset=0&aluno=Carlos
```

Exemplo de criação:

```json
{
    "aluno_nome": "Carlos Souza",
    "produto_id": 1,
    "quantidade": 2
}
```

O valor total é calculado automaticamente pela API, utilizando o preço cadastrado no banco de dados.

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/relatorios/vendas-por-categoria | Vendas agrupadas por categoria |
| GET | /api/relatorios/top-produtos | Cinco produtos mais vendidos |
| GET | /api/relatorios/faturamento | Faturamento por período |

Exemplo de faturamento:

```text
GET /api/relatorios/faturamento?inicio=2026-11-10&fim=2026-11-14
```

As datas devem utilizar o formato `YYYY-MM-DD`.
## Códigos HTTP

| Código | Descrição |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado com sucesso |
| 400 | Dados inválidos ou requisição incorreta |
| 404 | Registro não encontrado |
| 409 | Conflito ou estoque insuficiente |
| 500 | Erro interno do servidor |
## Regras de negócio

- O valor total dos pedidos é calculado utilizando o preço do produto armazenado no banco de dados.
- O sistema verifica se existe estoque suficiente antes de registrar um pedido.
- O estoque é reduzido automaticamente após a criação de um pedido.
- Produtos inativos não podem receber novos pedidos.
- Ao excluir um pedido, a quantidade correspondente retorna ao estoque.
- Produtos com histórico de pedidos não podem ser excluídos.
- Os campos obrigatórios são validados antes das operações.

## Transações no banco de dados

As transações do Knex.js são utilizadas nas operações de criação e exclusão de pedidos.

Na criação, a API registra o pedido e reduz o estoque dentro da mesma transação.

Na exclusão, a API remove o pedido e restaura o estoque dentro da mesma transação.

Isso garante que as operações sejam concluídas em conjunto. Caso ocorra um erro, as alterações são revertidas, evitando inconsistências nos dados.

## Banco de dados

O projeto utiliza SQLite3.

As migrations criam as tabelas:

- `produtos`
- `pedidos`

Os seeds inserem dados iniciais para testes, incluindo seis produtos e cinco pedidos.

## Execução em desenvolvimento

Para iniciar o servidor com reinicialização automática:

```bash
npm run dev
```

Para iniciar normalmente:

```bash
npm start
```
