const express = require('express');
const router = express.Router();


router.get('/',(req, res, next)=>{
    res.status(200).send({
        mensagem: 'Rota de produtos'
    })
});


router.post('/', (req, res, next)=>{

    const produto = {
        nome: req.body.nome,
        preco:  req.body.preco 
    };

    res.status(201).send({
        mensagem: 'Post da rota produtos',
        produtoCriado: produto
    })
})


router.get('/:id_produto', (req, res, next)=>{
    const id = req.params.id_produto

    if(id === 'especial'){
        res.status(200).send({
            mensagem: 'id de produto especifico.',
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