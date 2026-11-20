//Importar a biblioteca Express
import express from "express";

// Importar as variáveis de ambiente
import dotenv from "dotenv";

// Importar a biblioteca para permitir conexão externa
import cors from 'cors';

// Carregar as variáveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express();

//Criar um middleware para receber os dados no corpo da requisisção
app.use(express.json());

// Criar o midldleware para permitir requisição externa
app.use(cors());

//Incluir as controllers
import TestConnectionController from"./controllers/TestConnectionController";
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductsController from "./controllers/ProductsController";
import ProductCategoriesController from "./controllers/ProductCategoriesController";
import ProductSituationsController from "./controllers/ProductSituationsController";
import UsersController from "./controllers/UsersController";

//Criar as rotas
app.use("/", TestConnectionController)
app.use("/", AuthController)
app.use("/", SituationsController)
app.use("/", ProductsController)
app.use("/", ProductCategoriesController)
app.use("/", ProductSituationsController)
app.use("/", UsersController)

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});