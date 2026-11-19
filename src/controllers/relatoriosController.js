
const db = require('../database/connection');

// Relatório de vendas por categoria
async function vendasPorCategoria(req, res) {
    try {
        const relatorio = await db('pedidos')
            .join('produtos', 'pedidos.produto_id', 'produtos.id')
            .select('produtos.categoria')
                       .sum('pedidos.valor_total as faturamento')
            .sum('pedidos.quantidade as total_vendido')
            .count('pedidos.id as total_pedidos')
            .groupBy('produtos.categoria');

        return res.status(200).json(relatorio);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            erro: 'Erro ao gerar relatório de vendas por categoria.'
        });
    }
}

// Relatório dos cinco produtos mais vendidos
async function topProdutos(req, res) {
    try {
        const relatorio = await db('pedidos')
            .join('produtos', 'pedidos.produto_id', 'produtos.id')
            .select(
                'produtos.id',
                'produtos.nome',
                'produtos.categoria'
            )
            .sum('pedidos.quantidade as quantidade_vendida')
            .sum('pedidos.valor_total as faturamento')
            .groupBy('produtos.id', 'produtos.nome', 'produtos.categoria')
            .orderBy('quantidade_vendida', 'desc')
            .limit(5);

        return res.status(200).json(relatorio);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            erro: 'Erro ao gerar relatório dos produtos mais vendidos.'
        });
    }
}

// Validar se a data existe de verdade
function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return false;
    }

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataObjeto = new Date(Date.UTC(ano, mes - 1, dia));

    return (
        dataObjeto.getUTCFullYear() === ano &&
        dataObjeto.getUTCMonth() === mes - 1 &&
        dataObjeto.getUTCDate() === dia
    );
}

// Relatório de faturamento por período
async function faturamento(req, res) {
    try {
        const { data_inicio, data_fim } = req.query;

        if (
            !data_inicio ||
            !data_fim ||
            !dataValida(data_inicio) ||
            !dataValida(data_fim) ||
            data_inicio > data_fim
        ) {
            return res.status(400).json({
                erro: 'Informe data_inicio e data_fim válidos no formato YYYY-MM-DD.'
            });
        }

        const resultado = await db('pedidos')
            .whereBetween('created_at', [
                `${data_inicio} 00:00:00`,
                `${data_fim} 23:59:59`
            ])
            .sum('valor_total as faturamento')
            .count('id as total_pedidos')
            .first();

        return res.status(200).json({
            data_inicio,
            data_fim,
            faturamento: resultado.faturamento || 0,
            total_pedidos: resultado.total_pedidos || 0
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            erro: 'Erro ao gerar relatório de faturamento.'
        });
    }
}

module.exports = {
    vendasPorCategoria,
    topProdutos,
    faturamento
};
