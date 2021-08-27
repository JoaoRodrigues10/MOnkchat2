import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());



app.post('/chat', async (req, resp) => {
    try {

        if (!req.body.sala.nome || req.body.sala.nome == '') {
            return resp.send({ erro: 'Preencha o campo da sala' })
        }
        else if(!req.body.usuario.nome || req.body.usuario.nome == '') {
            return resp.send({ erro: 'Preencha o campo do usuario' })
        }
        
        let chat = req.body;
        let sala = await db.tb_sala.findOne({ where: { nm_sala: chat.sala.nome } });
        let usu = await db.tb_usuario.findOne({ where: { nm_usuario: chat.usuario.nome } })
        let mensagem = {
            id_sala: sala.id_sala,
            id_usuario: usu.id_usuario,
            ds_mensagem: chat.mensagem,
            dt_mensagem: new Date()
        }

        if(mensagem.ds_mensagem == '') {
            return resp.send({ erro: 'Você esqueceu de digitar sua mensagem' })
        }
    

        let r = await db.tb_chat.create(mensagem);
        resp.send(r);
        
    } catch (e) {
        resp.send( {erro: 'Deu erro'} );
        console.log(e.toString());
    }
});


app.get('/chat/:sala', async (req, resp) => {
    try {

        let sala = await db.tb_sala.findOne({where: { nm_sala: req.params.sala } } );

        let mensagens = await
            db.tb_chat.findAll({
                where: {
                    id_sala: sala.id_sala
                },
                order: [['id_chat', 'desc']],
                include: ['tb_usuario', 'tb_sala'],
            });
    
        resp.send(mensagens);
    } catch (e) {
        resp.send(e.toString())
    }
})

app.get('/usuario', async (req, resp) => {
   
    let usuarios = await db.tb_usuario.findAll();
    resp.send(usuarios)
})

app.get('/sala', async (req, resp) => {
   
    let salas = await db.tb_sala.findAll();
    resp.send(salas)
})

app.post('/usuario', async (req, resp) => {
    let usuario = req.body;

    let usuarioInserir = {
        nm_usuario: usuario.nome
    }
    let r = await db.tb_usuario.create(usuarioInserir);
    resp.send(r);
})

app.delete('/usuario', async (req, resp) => {
let id = req.query.id;

let r = await db.tb_usuario.destroy({ where: { id_usuario: id } })

resp.sendStatus(200);
})

app.put('/usuario', async (req, resp) => {
let id = req.query.id;
let nome = req.body.nome;

let r = await db.tb_usuario.update({ nm_usuario: nome }, { where: { id_usuario: id } }) 
resp.sendStatus(200);
})

app.delete('/sala', async (req, resp) => {
let id = req.query.id;

let r = await db.tb_sala.destroy({ where: { id_sala: id } })

resp.sendStatus(200);
})

app.put('/sala', async (req, resp) => {
let id = req.query.id;
let nome = req.body.nome;

let r = await db.tb_sala.update({ nm_sala: nome }, { where: { id_: id } }) 
resp.sendStatus(200);
})


app.listen(process.env.PORT,
           x => console.log(`>> Server up at port ${process.env.PORT}`))