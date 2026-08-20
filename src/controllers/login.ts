//Importar a biblioteca Express
import express, {Request, Response} from "express";

//Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";

// Criar a Aplicação Express
const router = express.Router();

//Inicializar a conexão com o banco de dados
AppDataSource.initialize().then(async () => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch((error) =>{
    console.log("Erro na conecção com o banco de dados!", error);
})

//Criar a rota GET principal
router.get("/", (req: Request, res: Response)=>{
    res.send("Bem-Vindo Pessoal! tela de login da rota");
})

//Exportar a instrução da rota

export default router;