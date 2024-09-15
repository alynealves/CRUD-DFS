const http = require ('http')
// ----------------- Aqui temos a estrutura básica de uso do protocolo padrão de comunicação com servidores web HTTP ---------------//
// const server = http.createServer((request, response) => {
//     response.end('Hello world!')
// })

// server.listen(3000, () => {
//     console.log('Server running')
// })
// ----------------------------------------------------------------------------------------------------------------------------------//

// ----------------- Aqui temos a chamada do express para utilizar os serviços HTTP -------------------------------------------------//
// const express = require('express')

// const app = express()

// app.use(express.json())
// -----------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------- Estrutura de array criado para usar as rotas básicas do CRUD da API -------------------------------//
// const usuarios = [
//     {id: 1, nome: "Alyne Costa", email: "aline@gmail.com"},
//     {id: 2, nome: "Felipe Ferreira", email: "felipe@gmail.com"},
//     {id: 3, nome: "Sarah Costa", email: "sarah@gmail.com"}
// ]
// -----------------------------------------------------------------------------------------------------------------------------------//

//----------------------------------- Criação do método GET/Listagem usando rota -----------------------------------------------------//
// app.get(('/listar'), (request, response) => {
//     response.status(200).json(usuarios)
// })
// -----------------------------------------------------------------------------------------------------------------------------------//

//----------------------------------- Criação do método POST/CRIAR usando rota -------------------------------------------------------//
// app.post(('/criar'), (request, response) =>{
//     const {nome, email } = request.body
//     usuarios.push({nome: nome, email: email})
//     response.status(201).json({nome: nome, email: email})
// })
// -----------------------------------------------------------------------------------------------------------------------------------//

//----------------------------------- Criação do método PUT/Atualizar usando rota -----------------------------------------------------//
// app.put(('/atualizar/:id'), (request, response) => {
//     const {nome, email} = request.body
//     const { id } = request.params
//     const usuario = usuarios.find(u => u.id == id)
//     if(usuario){
//         usuario.nome = nome
//         usuario.email = email
//         response.status(200).json(usuario)
//     }else{
//         response.status(404).json('Usuario nao encontrado')
//     }
// })
// -----------------------------------------------------------------------------------------------------------------------------------//

//----------------------------------- Criação do método DELETE/Excluir usando rota -----------------------------------------------------//
// app.delete(('/deletar/:id'), (request, response) => {
//     const { id } = request.params
//     const index = usuarios.findIndex(u => u.id == id)
//     if(index !== -1){
//         usuarios.splice(index, 1)
//         response.status(204).json('Usuario excluido')
//     }else{
//         response.status(404).json('Usuario nao encontrado')
//     }
// })
// -----------------------------------------------------------------------------------------------------------------------------------//

const express = require('express')

const app = express()

const pg = require('pg')

const { Pool } = pg

app.use(express.json())

const pool = new Pool({
    user: "postgres",
    password: "1234Abcd",
    database: "base",
    port: 5432

})

app.get(('/listar'), async(request, response) => {
    const pacientes = await pool.query('select * from pacientes')
   response.status(200).json(pacientes)
})

app.post(('/criar'), async(request, response) =>{
   const {nome, email, data_nascimento} = request.body
   const pacientes = await pool.query('insert into pacientes (nome, email, data_nascimento) values ($1, $2, $3)', [nome, email, data_nascimento])
    response.status(201).json({nome: nome, email: email, data_nascimento: data_nascimento})
 })

 app.put(('/atualizar/:id'), async(request, response) => {
  const {nome, email, data_nascimento} = request.body
     const { id } = request.params
     const paciente = await pool.query('select * from pacientes where id = $1', [id])
     if(paciente){
        const pacientes = await pool.query('update pacientes set nome = $1, email = $2, data_nascimento = $3 where id = $4', [nome, email, data_nascimento, id])
          response.status(200).json("usuario atualizado com sucesso!")
      }else{
      response.status(404).json('Usuario nao encontrado')
      }
     })

     app.delete(('/deletar/:id'), async(request, response) => {
     const { id } = request.params
     const paciente = await pool.query('select * from pacientes where id = $1', [id])
     if(paciente){
        const pacientes = await pool.query('delete from pacientes where id = $1', [id])
          response.status(200).json("usuario excluído com sucesso!")
      }else{
      response.status(404).json('Usuario nao encontrado')
      }
 })

app.listen(3000, () => {
    console.log('Servidor rodando')
})
