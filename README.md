# API Cantina ULBRA

API REST desenvolvida em Node.js para gerenciamento de produtos, pedidos e relatórios de vendas da cantina ULBRA.

## Integrantes

- Jorge Gabriel

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

### 1. Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/produtos | Listar produtos |
| GET | /api/produtos/:id | Buscar produto por ID |
| POST | /api/produtos | Cadastrar produto |
| PUT | /api/produtos/:id | Atualizar produto |
| DELETE | /api/produtos/:id | Excluir produto |

#### GET /api/produtos

Lista todos os produtos.

Filtros opcionais:

- `categoria`: filtra pela categoria.
- `ativo`: filtra produtos ativos ou inativos.

Exemplos de requisição:

```text
GET /api/produtos
GET /api/produtos?categoria=Lanches
GET /api/produtos?ativo=true
```

Exemplo de resposta:

```json
[
    {
        "id": 1,
        "nome": "X-Burguer",
        "categoria": "Lanches",
        "preco": 15,
        "estoque": 28,
        "ativo": 1
    },
    {
        "id": 2,
        "nome": "X-Salada",
        "categoria": "Lanches",
        "preco": 18,
        "estoque": 23,
        "ativo": 1
    }
]
```

#### GET /api/produtos/:id

Busca um produto específico pelo ID.

Requisição:

```text
GET /api/produtos/1
```

Exemplo de resposta:

```json
{
    "id": 1,
    "nome": "X-Burguer",
    "categoria": "Lanches",
    "preco": 15,
    "estoque": 28,
    "ativo": 1
}
```

#### POST /api/produtos

Cadastra um novo produto.

Requisição:

```json
{
    "nome": "Refrigerante",
    "categoria": "Bebidas",
    "preco": 5.00,
    "estoque": 30
}
```

Exemplo de resposta (201):

```json
{
    "id": 7,
    "nome": "Refrigerante",
    "categoria": "Bebidas",
    "preco": 5,
    "estoque": 30,
    "ativo": 1
}
```

#### PUT /api/produtos/:id

Atualiza os dados de um produto, incluindo seu estado ativo.

Requisição:

```text
PUT /api/produtos/1
```

Corpo da requisição:

```json
{
    "nome": "X-Burguer Especial",
    "categoria": "Lanches",
    "preco": 18.00,
    "estoque": 30,
    "ativo": true
}
```

Exemplo de resposta:

```json
{
    "id": 1,
    "nome": "X-Burguer Especial",
    "categoria": "Lanches",
    "preco": 18,
    "estoque": 30,
    "ativo": 1
}
```

#### DELETE /api/produtos/:id

Exclui um produto que não possui histórico de pedidos.

Requisição:

```text
DELETE /api/produtos/7
```

Exemplo de resposta:

```text
Status: 204 No Content
```

Produtos que possuem pedidos vinculados não podem ser excluídos e retornam status 409.

### 2. Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/pedidos | Listar pedidos |
| GET | /api/pedidos/:id | Buscar pedido por ID |
| POST | /api/pedidos | Criar pedido |
| DELETE | /api/pedidos/:id | Excluir pedido |

#### GET /api/pedidos

Lista os pedidos utilizando paginação obrigatória com `limit` e `offset`.

Também permite filtrar pelo nome do aluno utilizando `aluno`.

Requisições:

```text
GET /api/pedidos?limit=10&offset=0
GET /api/pedidos?limit=10&offset=0&aluno=João
```

Exemplo de resposta:

```json
[
    {
        "id": 1,
        "aluno_nome": "João Silva",
        "produto_id": 1,
        "quantidade": 2,
        "valor_total": 30,
        "created_at": "2026-11-10 10:00:00",
        "updated_at": "2026-11-10 10:00:00"
    }
]
```

#### GET /api/pedidos/:id

Busca um pedido específico e utiliza JOIN para retornar também o nome do produto.

Requisição:

```text
GET /api/pedidos/1
```

Exemplo de resposta:

```json
{
    "id": 1,
    "aluno_nome": "João Silva",
    "produto_id": 1,
    "quantidade": 2,
    "valor_total": 30,
    "produto_nome": "X-Burguer",
    "created_at": "2026-11-10 10:00:00",
    "updated_at": "2026-11-10 10:00:00"
}
```

#### POST /api/pedidos

Cria um pedido e reduz automaticamente o estoque do produto.

Requisição:

```json
{
    "aluno_nome": "Carlos Souza",
    "produto_id": 1,
    "quantidade": 2
}
```

Exemplo de resposta (201):

```json
{
    "id": 6,
    "aluno_nome": "Carlos Souza",
    "produto_id": 1,
    "quantidade": 2,
    "valor_total": 30
}
```

O valor total é calculado pela API utilizando o preço cadastrado no banco de dados, sem considerar um possível valor enviado pelo cliente.

#### DELETE /api/pedidos/:id

Exclui um pedido e devolve a quantidade correspondente ao estoque do produto.

Requisição:

```text
DELETE /api/pedidos/1
```

Exemplo de resposta:

```text
Status: 204 No Content
```

### 3. Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/relatorios/vendas-por-categoria | Vendas agrupadas por categoria |
| GET | /api/relatorios/top-produtos | Cinco produtos mais vendidos |
| GET | /api/relatorios/faturamento | Faturamento por período |

#### GET /api/relatorios/vendas-por-categoria

Retorna o faturamento, a quantidade de itens vendidos e o total de pedidos agrupados por categoria.

Requisição:

```text
GET /api/relatorios/vendas-por-categoria
```

Exemplo de resposta:

```json
[
    {
        "categoria": "Bebidas",
        "faturamento": 6,
        "total_vendido": 1,
        "total_pedidos": 1
    },
    {
        "categoria": "Lanches",
        "faturamento": 66,
        "total_vendido": 4,
        "total_pedidos": 2
    },
    {
        "categoria": "Salgados",
        "faturamento": 37,
        "total_vendido": 5,
        "total_pedidos": 2
    }
]
```

#### GET /api/relatorios/top-produtos

Retorna os cinco produtos mais vendidos, com nome, categoria, quantidade vendida e faturamento.

Requisição:

```text
GET /api/relatorios/top-produtos
```

Exemplo de resposta:

```json
[
    {
        "id": 3,
        "nome": "Coxinha",
        "categoria": "Salgados",
        "quantidade_vendida": 3,
        "faturamento": 21
    },
    {
        "id": 1,
        "nome": "X-Burguer",
        "categoria": "Lanches",
        "quantidade_vendida": 2,
        "faturamento": 30
    },
    {
        "id": 2,
        "nome": "X-Salada",
        "categoria": "Lanches",
        "quantidade_vendida": 2,
        "faturamento": 36
    },
    {
        "id": 4,
        "nome": "Pastel de Carne",
        "categoria": "Salgados",
        "quantidade_vendida": 2,
        "faturamento": 16
    },
    {
        "id": 5,
        "nome": "Suco de Laranja",
        "categoria": "Bebidas",
        "quantidade_vendida": 1,
        "faturamento": 6
    }
]
```

#### GET /api/relatorios/faturamento

Retorna a soma do valor total dos pedidos dentro de um período informado.

Requisição:

```text
GET /api/relatorios/faturamento?data_inicio=2026-11-10&data_fim=2026-11-18
```

As datas devem utilizar o formato `YYYY-MM-DD`.

Exemplo de resposta:

```json
{
    "data_inicio": "2026-11-10",
    "data_fim": "2026-11-18",
    "faturamento": 109,
    "total_pedidos": 5
}
```

## Códigos HTTP

| Código | Descrição |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado com sucesso |
| 204 | Operação concluída sem conteúdo de resposta |
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

Os seeds inserem dados iniciais para testes, incluindo seis produtos e cinco pedidos com datas diferentes.

## Execução em desenvolvimento

Para iniciar o servidor com reinicialização automática:

```bash
npm run dev
```

Para iniciar normalmente:

```bash
npm start
```