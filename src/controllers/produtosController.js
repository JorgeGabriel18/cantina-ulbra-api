
const db = require('../database/connection');

// Listar todos os produtos
async function listarProdutos(req, res) {
    try {
        const { categoria, ativo } = req.query;

        if (ativo !== undefined && ativo !== 'true' && ativo !== 'false') {
            return res.status(400).json({
                erro: 'O filtro ativo deve ser true ou false.'
            });
        }

       let consulta = db('produtos').select(
    'id',
    'nome',
    'categoria',
    'preco',
    'estoque',
    'ativo'
);

        if (categoria !== undefined) {
            consulta = consulta.where('categoria', categoria);
        }

        if (ativo !== undefined) {
            consulta = consulta.where('ativo', ativo === 'true');
        }

        const produtos = await consulta;

        return res.status(200).json(produtos);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao listar produtos.' });
    }
}

// Buscar produto por ID
async function buscarProduto(req, res) {
    try {
        const { id } = req.params;

        const produto = await db('produtos')
            .where({ id })
            .first();

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        return res.status(200).json(produto);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar produto.' });
    }
}

// Cadastrar produto
async function criarProduto(req, res) {
    try {
        let { nome, categoria, preco, estoque } = req.body;

        if (
            typeof nome !== 'string' ||
            typeof categoria !== 'string' ||
            !nome.trim() ||
            !categoria.trim() ||
            nome.trim().length > 80 ||
            categoria.trim().length > 30 ||
            preco === undefined ||
            preco === null ||
            preco === '' ||
            !Number.isFinite(Number(preco)) ||
            Number(preco) <= 0 ||
            Number(preco) > 999999.99 ||
            estoque === undefined ||
            estoque === null ||
            estoque === '' ||
            !Number.isSafeInteger(Number(estoque)) ||
            Number(estoque) < 0
        ) {
            return res.status(400).json({
                erro: 'Dados inválidos ou campos obrigatórios ausentes.'
            });
        }

        nome = nome.trim();
        categoria = categoria.trim();
        preco = Number(preco);
        estoque = Number(estoque);

        const existente = await db('produtos')
            .where({ nome })
            .first();

        if (existente) {
            return res.status(409).json({
                erro: 'Já existe um produto com esse nome.'
            });
        }

        const [id] = await db('produtos').insert({
            nome,
            categoria,
            preco,
            estoque
        });

        const produto = await db('produtos')
            .where({ id })
            .first();

        return res.status(201).json(produto);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
    }
}

// Atualizar produto
async function atualizarProduto(req, res) {
    try {
        const { id } = req.params;
        let { nome, categoria, preco, estoque, ativo } = req.body;

        const produto = await db('produtos')
            .where({ id })
            .first();

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        if (
            (nome !== undefined &&
                (typeof nome !== 'string' ||
                    !nome.trim() ||
                    nome.trim().length > 80)) ||

            (categoria !== undefined &&
                (typeof categoria !== 'string' ||
                    !categoria.trim() ||
                    categoria.trim().length > 30)) ||

            (preco !== undefined &&
                (preco === null ||
                    preco === '' ||
                    !Number.isFinite(Number(preco)) ||
                    Number(preco) <= 0 ||
                    Number(preco) > 999999.99)) ||

            (estoque !== undefined &&
                (estoque === null ||
                    estoque === '' ||
                    !Number.isSafeInteger(Number(estoque)) ||
                    Number(estoque) < 0)) ||

            (ativo !== undefined && typeof ativo !== 'boolean')
        ) {
            return res.status(400).json({
                erro: 'Dados inválidos para atualização do produto.'
            });
        }

        if (nome !== undefined) {
            nome = nome.trim();

            if (nome !== produto.nome) {
                const existente = await db('produtos')
                    .where({ nome })
                    .whereNot({ id })
                    .first();

                if (existente) {
                    return res.status(409).json({
                        erro: 'Já existe um produto com esse nome.'
                    });
                }
            }
        }

        if (categoria !== undefined) {
            categoria = categoria.trim();
        }

        await db('produtos')
            .where({ id })
            .update({
                nome: nome ?? produto.nome,
                categoria: categoria ?? produto.categoria,
                preco: preco !== undefined ? Number(preco) : produto.preco,
                estoque: estoque !== undefined ? Number(estoque) : produto.estoque,
                ativo: ativo ?? produto.ativo
            });

        const atualizado = await db('produtos')
            .where({ id })
            .first();

        return res.status(200).json(atualizado);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao atualizar produto.' });
    }
}

// Excluir produto
async function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const produto = await db('produtos')
            .where({ id })
            .first();

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        const pedidos = await db('pedidos')
            .where({ produto_id: id })
            .first();

        if (pedidos) {
            return res.status(409).json({
                erro: 'Não é possível excluir um produto que possui histórico de pedidos.'
            });
        }

        await db('produtos')
            .where({ id })
            .del();

       return res.status(204).send();

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao excluir produto.' });
    }
}

module.exports = {
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto
};
