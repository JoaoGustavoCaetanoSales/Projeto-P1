//Importar a biblioteca Express
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

// Criar a Aplicação Express
const router = express.Router();

//Criar a LISTA
router.get("/situations", async(req:Request, res:Response)=>{
    try{

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return

    }catch(error){
        res.status(500).json({
            messagem : "Erro ao listar situação!",
        });
        return
    }

});

//Criar a Visualização do item cadastrado em situação
router.get("/situations/:id", async(req:Request, res:Response)=>{
    try{
        
        const {id} = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.findOneBy({id: parseInt(id as string, 10)});

        if(!situations){
            res.status(404).json({
                messagem : "Situação não encontrada!",
            });
            return
        }

        res.status(200).json(situations);
        return

    }catch(error){
        res.status(500).json({
            messagem : "Erro ao listar situação!",
        });
        return
    }

});

//Criar a rota POST
router.post("/situations", async(req:Request, res:Response)=>{

    try{
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem : "Situação cadastrada com sucesso!",
            situation: newSituation,
        });

    }catch(error){

        res.status(500).json({
            messagem : "Erro ao cadastrar situação!",
        });
    }

});

//Exportar a instrução da rota

export default router;