const express = require('express');

const router = express.Router();

const produtosController = require('../controllers/produtosController');

// Listar produtos
router.get('/', produtosController.listarProdutos);

// Buscar produto por ID
router.get('/:id', produtosController.buscarProduto);

// Cadastrar produto
router.post('/', produtosController.criarProduto);

// Atualizar produto
router.put('/:id', produtosController.atualizarProduto);

// Excluir produto
router.delete('/:id', produtosController.excluirProduto);

module.exports = router;