
const db = require('../database/connection');

// Listar pedidos com paginação e filtro por aluno
async function listarPedidos(req, res) {
    try {
        const { limit, offset, aluno } = req.query;

        const limite = Number(limit);
        const deslocamento = Number(offset);

        if (
            limit === undefined ||
            limit === '' ||
            offset === undefined ||
            offset === '' ||
            !Number.isSafeInteger(limite) ||
            limite < 1 ||
            !Number.isSafeInteger(deslocamento) ||
            deslocamento < 0
        ) {
            return res.status(400).json({
                erro: 'Informe limit e offset válidos.'
            });
        }

        let consulta = db('pedidos')
            .select('*')
            .limit(limite)
            .offset(deslocamento);

        if (aluno) {
            consulta = consulta.where('aluno_nome', 'like', `%${aluno}%`);
        }

        const pedidos = await consulta;

        return res.status(200).json(pedidos);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao listar pedidos.' });
    }
}

// Buscar pedido por ID com nome do produto
async function buscarPedido(req, res) {
    try {
        const { id } = req.params;

        const pedido = await db('pedidos')
            .join('produtos', 'pedidos.produto_id', 'produtos.id')
            .select(
                'pedidos.*',
                'produtos.nome as produto_nome'
            )
            .where('pedidos.id', id)
            .first();

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado.' });
        }

        return res.status(200).json(pedido);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar pedido.' });
    }
}

// Criar pedido com transação e baixa de estoque
async function criarPedido(req, res) {
    try {
        let { aluno_nome, produto_id, quantidade } = req.body;

        if (
            typeof aluno_nome !== 'string' ||
            !aluno_nome.trim() ||
            aluno_nome.trim().length > 100 ||
            produto_id === undefined ||
            produto_id === null ||
            produto_id === '' ||
            !Number.isSafeInteger(Number(produto_id)) ||
            Number(produto_id) <= 0 ||
            quantidade === undefined ||
            quantidade === null ||
            quantidade === '' ||
            !Number.isSafeInteger(Number(quantidade)) ||
            Number(quantidade) < 1
        ) {
            return res.status(400).json({
                erro: 'Informe aluno_nome, produto_id e quantidade válidos.'
            });
        }

        aluno_nome = aluno_nome.trim();
        produto_id = Number(produto_id);
        quantidade = Number(quantidade);

        const resultado = await db.transaction(async (trx) => {
            const produto = await trx('produtos')
                .where({ id: produto_id })
                .first();

            if (!produto) {
                const erro = new Error('Produto não encontrado.');
                erro.status = 404;
                throw erro;
            }

            if (!produto.ativo) {
                const erro = new Error('Produto inativo não pode ser pedido.');
                erro.status = 400;
                throw erro;
            }

            if (produto.estoque < quantidade) {
                const erro = new Error('Estoque insuficiente.');
                erro.status = 409;
                throw erro;
            }

            const valor_total = Number(
                (Number(produto.preco) * quantidade).toFixed(2)
            );

            const [id] = await trx('pedidos').insert({
                aluno_nome,
                produto_id,
                quantidade,
                valor_total
            });

            await trx('produtos')
                .where({ id: produto_id })
                .decrement('estoque', quantidade);

            return trx('pedidos').where({ id }).first();
        });

        return res.status(201).json(resultado);

    } catch (erro) {
        console.error(erro);
        return res.status(erro.status || 500).json({
            erro: erro.message || 'Erro ao criar pedido.'
        });
    }
}

// Excluir pedido e devolver estoque
async function excluirPedido(req, res) {
    try {
        const { id } = req.params;

        await db.transaction(async (trx) => {
            const pedido = await trx('pedidos')
                .where({ id })
                .first();

            if (!pedido) {
                const erro = new Error('Pedido não encontrado.');
                erro.status = 404;
                throw erro;
            }

            await trx('produtos')
                .where({ id: pedido.produto_id })
                .increment('estoque', pedido.quantidade);

            await trx('pedidos')
                .where({ id })
                .del();
        });

        return res.status(200).json({
            mensagem: 'Pedido excluído e estoque restaurado com sucesso.'
        });

    } catch (erro) {
        console.error(erro);
        return res.status(erro.status || 500).json({
            erro: erro.message || 'Erro ao excluir pedido.'
        });
    }
}

module.exports = {
    listarPedidos,
    buscarPedido,
    criarPedido,
    excluirPedido
};
