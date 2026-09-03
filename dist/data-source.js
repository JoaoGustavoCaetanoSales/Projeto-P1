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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Situations_1 = require("./entity/Situations");
const Users_1 = require("./entity/Users");
// Importar as variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar as variáveis do .env
dotenv_1.default.config();
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situations_1.Situation, Users_1.User],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
});
//Inicializar a conexão com o banco de dados
exports.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Conexão com o banco de dados realizada com sucesso!");
})).catch((error) => {
    console.log("Erro na conecção com o banco de dados!", error);
});
