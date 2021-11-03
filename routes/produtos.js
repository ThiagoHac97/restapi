const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os produtos
router.get('/',(req, res, next)=> {
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error })} 
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, fields) => {
                if(error){ return res.status(500).send({error: error})} 
                return res.status(200).send({response: resultado})
            }
        )
        conn.release();
   });
});

//Insere Produto
router.post('/', (req, res, next)=>{


    mysql.getConnection((error, conn)=>{
        if(error){
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'INSERT INTO produtos (produtoscol, preco) VALUES(?,?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) =>{
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso.',
                    id_produto: resultado.insertId
                })
            }
        )
    }) 
})

//Retorna um produto especifico
router.get('/:id_produtos', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error })} 
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?;',
            [req.params.id_produtos],
            (error, resultado, fields) => {
                if(error){ return res.status(500).send({error: error})} 
                return res.status(200).send({response: resultado})
            }
        )
        conn.release();
   });
})

router.patch('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error}) }
        conn.query(
            `UPDATE produtos
             SET produtoscol = ?,
                preco = ?
             WHERE id_produtos = ?`,
            
            [req.body.nome, req.body.preco, req.body.id_produtos],
            (error, resultado, field) =>{
                conn.release();

                if(error){return res.status(500).send({error: error,response: null});}
                res.status(202).send({
                    mensagem: 'Produto alterado com sucesso.',
                })
            }
        )
    }) 
})

router.delete('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error}) }
        conn.query(
            `DELETE FROM produtos WHERE id_produtos = ?`,
            
            [req.body.id_produtos],
            (error, resultado, field) =>{
                conn.release();

                if(error){return res.status(500).send({error: error,response: null});}
                res.status(202).send({
                    mensagem: 'Produto removido com sucesso.',
                })
            }
        )
    }) 
})

module.exports = router;