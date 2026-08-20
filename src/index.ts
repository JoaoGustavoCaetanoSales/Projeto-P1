//Importar a biblioteca Express
import express from "express";

// Importar as variáveis de ambiente
import dotenv from "dotenv";

// Carregar as variáveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express();

//Incluir as controllers
import login from "./controllers/login";

//Criar as rotas
app.use("/", login)

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});