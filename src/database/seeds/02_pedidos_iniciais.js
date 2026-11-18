
exports.seed = async function (knex) {
    await knex('pedidos').del();

    // Reinicia a sequência de IDs dos pedidos
    await knex.raw(
        "DELETE FROM sqlite_sequence WHERE name = 'pedidos'"
    );

    await knex('pedidos').insert([
        {
            aluno_nome: 'João Silva',
            produto_id: 1,
            quantidade: 2,
            valor_total: 30.00,
            created_at: '2026-11-10 10:00:00',
            updated_at: '2026-11-10 10:00:00'
        },
        {
            aluno_nome: 'Maria Santos',
            produto_id: 3,
            quantidade: 3,
            valor_total: 21.00,
            created_at: '2026-11-11 11:30:00',
            updated_at: '2026-11-11 11:30:00'
        },
        {
            aluno_nome: 'Pedro Oliveira',
            produto_id: 5,
            quantidade: 1,
            valor_total: 6.00,
            created_at: '2026-11-12 14:00:00',
            updated_at: '2026-11-12 14:00:00'
        },
        {
            aluno_nome: 'Ana Costa',
            produto_id: 2,
            quantidade: 2,
            valor_total: 36.00,
            created_at: '2026-11-13 09:15:00',
            updated_at: '2026-11-13 09:15:00'
        },
        {
            aluno_nome: 'Lucas Pereira',
            produto_id: 4,
            quantidade: 2,
            valor_total: 16.00,
            created_at: '2026-11-14 15:45:00',
            updated_at: '2026-11-14 15:45:00'
        }
    ]);

    // Atualiza o estoque conforme os pedidos iniciais
    await knex('produtos').where({ id: 1 }).decrement('estoque', 2);
    await knex('produtos').where({ id: 2 }).decrement('estoque', 2);
    await knex('produtos').where({ id: 3 }).decrement('estoque', 3);
    await knex('produtos').where({ id: 4 }).decrement('estoque', 2);
    await knex('produtos').where({ id: 5 }).decrement('estoque', 1);
};
