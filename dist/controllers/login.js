"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
//Importar o arquivo com as credenciais do banco de dados
const data_source_1 = require("../data-source");
// Criar a Aplicação Express
const router = express_1.default.Router();
//Inicializar a conexão com o banco de dados
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Conexão com o banco de dados realizada com sucesso!");
})).catch((error) => {
    console.log("Erro na conecção com o banco de dados!", error);
});
//Criar a rota GET principal
router.get("/", (req, res) => {
    res.send("Bem-Vindo Pessoal! tela de login da rota");
});
//Exportar a instrução da rota
exports.default = router;
