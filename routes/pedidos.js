const express = require('express');
const router = express.Router();


router.get('/',(req, res, next)=>{
    res.status(200).send({
        mensagem: 'Rota de pedidos'
    })
});


router.post('/', (req, res, next)=>{
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    };

    res.status(201).send({
        mensagem: 'Post da rota pedidos',
        pedidoCriado: pedido
    })
})


router.get('/:id_pedido', (req, res, next)=>{
    const id = req.params.id_pedido

    if(id === 'especial'){
        res.status(200).send({
            mensagem: 'id de pedidos especifico.',
            id: id
        })
    }
    else{
        res.status(200).send({
            mensagem:'id qualquer.'
        })
    }
})

router.patch('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'PATCH da rota produtos'
    })
})

router.delete('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'DELETE da rota produtos'
    })
})

module.exports = router;