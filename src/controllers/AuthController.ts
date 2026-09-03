//Importar a biblioteca Express
import express, {Request, Response} from "express";

// Criar a Aplicação Express
const router = express.Router();

//Criar a rota GET principal
router.get("/", (req: Request, res: Response)=>{
    res.send("Bem-Vindo Pessoal! tela de login da rota");
})

//Exportar a instrução da rota

export default router;