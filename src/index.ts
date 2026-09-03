//Importar a biblioteca Express
import express from "express";

// Importar as variáveis de ambiente
import dotenv from "dotenv";

// Carregar as variáveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express();

//Criar um middleware para receber os dados no corpo da requisisção
app.use(express.json());

//Incluir as controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";

//Criar as rotas
app.use("/", AuthController)
app.use("/", SituationsController)

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});