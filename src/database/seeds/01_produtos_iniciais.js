
exports.seed = async function (knex) {
    await knex('pedidos').del();
    await knex('produtos').del();

    // Reinicia a sequência de IDs do SQLite
    await knex.raw(
        "DELETE FROM sqlite_sequence WHERE name = 'produtos'"
    );

    await knex('produtos').insert([
        { nome: 'X-Burguer', categoria: 'Lanches', preco: 15.00, estoque: 30, ativo: true },
        { nome: 'X-Salada', categoria: 'Lanches', preco: 18.00, estoque: 25, ativo: true },
        { nome: 'Coxinha', categoria: 'Salgados', preco: 7.00, estoque: 40, ativo: true },
        { nome: 'Pastel de Carne', categoria: 'Salgados', preco: 8.00, estoque: 35, ativo: true },
        { nome: 'Suco de Laranja', categoria: 'Bebidas', preco: 6.00, estoque: 20, ativo: true },
        { nome: 'Água Mineral', categoria: 'Bebidas', preco: 3.50, estoque: 50, ativo: true }
    ]);
};
