
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

Exemplos:

```text
GET /api/produtos
GET /api/produtos?categoria=Lanches
GET /api/produtos?ativo=true
GET /api/produtos/1
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

Exemplo de resposta:

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

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/pedidos | Listar pedidos |
| GET | /api/pedidos/:id | Buscar pedido por ID |
| POST | /api/pedidos | Criar pedido |
| DELETE | /api/pedidos/:id | Excluir pedido |

A listagem utiliza paginação obrigatória com `limit` e `offset`, além do filtro opcional `aluno`.

Exemplos:

```text
GET /api/pedidos?limit=10&offset=0
GET /api/pedidos?limit=10&offset=0&aluno=Carlos
GET /api/pedidos/1
```

Exemplo de criação:

```json
{
    "aluno_nome": "Carlos Souza",
    "produto_id": 1,
    "quantidade": 2
}
```

Exemplo de resposta:

```json
{
    "id": 6,
    "aluno_nome": "Carlos Souza",
    "produto_id": 1,
    "quantidade": 2,
    "valor_total": 30
}
```

O valor total é calculado automaticamente pela API, utilizando o preço cadastrado no banco de dados.

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/relatorios/vendas-por-categoria | Vendas agrupadas por categoria |
| GET | /api/relatorios/top-produtos | Cinco produtos mais vendidos |
| GET | /api/relatorios/faturamento | Faturamento por período |

Exemplo de vendas por categoria:

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

Exemplo dos cinco produtos mais vendidos:

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

Exemplo de faturamento:

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