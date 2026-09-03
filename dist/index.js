"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
// Importar as variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar as variáveis do .env
dotenv_1.default.config();
// Criar a Aplicação Express
const app = (0, express_1.default)();
//Criar um middleware para receber os dados no corpo da requisisção
app.use(express_1.default.json());
//Incluir as controllers
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const SituationsController_1 = __importDefault(require("./controllers/SituationsController"));
//Criar as rotas
app.use("/", AuthController_1.default);
app.use("/", SituationsController_1.default);
//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, () => {
    console.log(`Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});
