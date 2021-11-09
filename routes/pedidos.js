const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os pedidos
router.get('/',(req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error })} 
        conn.query(
            `SELECT pedidos.id_pedidos,
            pedidos.quantidade,
            produtos.id_produtos,
            produtos.nome,
            produtos.preco
            FROM pedidos
            INNER JOIN produtos
            ON produtos.id_produtos = pedidos.id_produtos`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error})}
                const response = {
                    pedidos: result.map(pedido =>{
                        return{
                            id_pedidos  : pedido.id_pedidos,
                            quantidade: pedido.quantidade,
                            produto:{
                                id_produtos: pedido.id_produtos,
                                nome: pedido.nome,
                                preco: pedido.preco    
                            },
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos.',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedidos
                            }
                        }
                    })
                } 
                return res.status(200).send(response)
            }
        )
        conn.release();
   });
});

//Insere um pedido
router.post('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error});}
        conn.query('SELECT * FROM produtos WHERE id_produtos = ?', 
        [req.body.id_produtos], 
        (error, result, field) =>{
            if(error){return res.status(500).send({error: error});} 
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: 'Não foi encontrado nenhum produto com este ID'
                })
            }
            conn.query(
                'INSERT INTO pedidos (id_produtos, quantidade) VALUES(?,?)',
                [req.body.id_produtos, req.body.quantidade],
                (error, result, field) =>{
                    conn.release();
                    if(error){return res.status(500).send({error: error,response: null})}
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado:{
                            id_pedidos: result.id_pedidos,
                            id_produtos: req.body.id_produtos,
                            quantidade: req.body.quantidade,
                            request:{
                                tipo: 'POST',
                                descricao: 'Insere um pedido',
                                url: 'http://localhost:3000/pedidos'
                            }
                        }
                    }                 
                   return res.status(201).send(response);
                }
            )

        })
    });
})

//Retorna um pedido especifico
router.get('/:id_pedidos', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error })} 
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedidos],
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error})}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum pedido com este ID'
                    })
                }
                const response = {
                    pedidos:{
                        id_pedidos: result[0].id_pedidos,
                        id_produtos : result[0].id_produtos,
                        quantidade: result[0].quantidade,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna um pedido especifico.',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                } 
                return res.status(200).send(response)
            }
        )
        conn.release();
   });
})

router.patch('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'PATCH da rota produtos'
    })
})

router.delete('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error}) }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?`, [req.body.id_pedidos],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error: error,response: null});}
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request:{
                        tipo:'DELETE',
                        descricao: 'Deleta um pedido',
                        url: 'https://localhost:3000/pedidos',
                        body:{
                            id_produtos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    }) 
})

module.exports = router;