
const express = require('express');

const app = express();
const PORT = 3000;

// Importação das rotas
const produtosRoutes = require('./routes/produtosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');

// Permite receber dados em formato JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'API Cantina ULBRA funcionando!'
    });
});

// Registro das rotas da API
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
