const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null, true);    
    }
    else{
        cb(null, false)
    }
}
const upload = multer({storage: storage,
                       limits:{
                            fileSize: 1024 * 1024 * 5
                       },
                       fileFilter: fileFilter                    
});

//Retorna todos os produtos
router.get('/',(req, res, next)=> {
    mysql.getConnection((error, conn)=>{
        if(error){ return res.status(500).send({error: error })} 
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod =>{
                        return{
                            id_produtos : prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos.',
                                url: 'http://localhost:3000/produtos/' + prod.id_produtos
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

//Insere Produto
router.post('/', upload.single('produto_imagem'), (req, res, next)=>{
    console.log(req.file)
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error});}
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES(?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, field) =>{
                conn.release();

                if(error){return res.status(500).send({error: error,response: null})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado:{
                        id_produtos: result.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request:{
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }                 
               return res.status(201).send(response);
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
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error})}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }
                const response = {
                    produto:{
                        id_produtos: result[0].id_produtos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna um produto especifico.',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                } 
                return res.status(200).send(response)
            }
        )
        conn.release();
   });
})

//Altera um produto especifico
router.patch('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error}) }
        conn.query(
            `UPDATE produtos
             SET nome = ?,
                preco = ?
             WHERE id_produtos = ?`,
            
            [req.body.nome, req.body.preco, req.body.id_produtos],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error: error,response: null});}
                const response = {
                    mensagem: 'Produto alterado com sucesso',
                    produtoAtualizado:{
                        id_produtos: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request:{
                            tipo: 'PATCH',
                            descricao: 'Altera um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produtos
                        }
                    }
                } 
                res.status(202).send(response);
            }
        )
    }) 
})

//Deleta um produto especifico
router.delete('/', (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error: error}) }
        conn.query(
            `DELETE FROM produtos WHERE id_produtos = ?`,
            
            [req.body.id_produtos],
            (error, result, field) =>{
                conn.release();

                if(error){return res.status(500).send({error: error,response: null});}
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request:{
                        tipo:'POST',
                        descricao: 'Deleta um produto',
                        url: 'https://localhost:3000/produtos',
                        body:{
                            nome: 'String',
                            preco: 'Float'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    }) 
})

module.exports = router;