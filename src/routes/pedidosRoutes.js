const express = require('express');

const router = express.Router();

const pedidosController = require('../controllers/pedidosController');

// Listar pedidos
router.get('/', pedidosController.listarPedidos);

// Buscar pedido por ID
router.get('/:id', pedidosController.buscarPedido);

// Criar pedido
router.post('/', pedidosController.criarPedido);

// Excluir pedido
router.delete('/:id', pedidosController.excluirPedido);

module.exports = router;