//Importar a biblioteca Express
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup";

// Criar a Aplicação Express
const router = express.Router();

//Criar a LISTA
router.get("/situations", async(req:Request, res:Response)=>{
    try{

        // Obter o repositório da entidade Situation
        const situationRepository = AppDataSource.getRepository(Situation);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(situationRepository, page, limit, {id: "DESC"});

        // Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result);
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
            messagem : "Erro ao visualizar situação!",
        });
        return
    }

});

//Criar a rota POST
router.post("/situations", async(req:Request, res:Response)=>{

    try{
        var data = req.body;

        const schema = yup.object().shape({
            nameSituation: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
        });

        await schema.validate(data, {abortEarly: false});

        const situationRepository = AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem : "Situação cadastrada com sucesso!",
            situation: newSituation,
        });

    }catch(error){
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem : error.errors
            });
            return;
        }

        res.status(500).json({
            messagem : "Erro ao cadastrar situação!",
        });
    }

});

//Criar a rota PUT para atualizar uma situação
router.put("/situations/:id", async(req:Request, res:Response)=>{
    try{
        
        const {id} = req.params;

        var data = req.body;

        const schema = yup.object().shape({
            nameSituation: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
        });

        await schema.validate(data, {abortEarly: false});

        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.findOneBy({id: parseInt(id as string, 10)});

        if(!situations){
            res.status(404).json({
                messagem : "Situação não encontrada!",
            });
            return
        }
        //Atualiza os dados
        situationRepository.merge(situations, data);

        //Salvar as alterações de dados
        const updatedSituation = await situationRepository.save(situations);

        res.status(200).json({
            messagem : "Situação atualizada com sucesso!",
            situation: updatedSituation,
        });

    }catch(error){
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem : error.errors
            });
            return;
        }
        res.status(500).json({
            messagem : "Erro ao atualizar situação!",
        });
    }

});

//Criar a rota DELETE para excluir uma situação
router.delete("/situations/:id", async(req:Request, res:Response)=>{
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
        
        //Remover os dados no banco de dados
        await situationRepository.remove(situations);

        res.status(200).json({
            messagem : "Situação excluída com sucesso!",
            
        });

    }catch(error){
        res.status(500).json({
            messagem : "Erro ao atualizar situação!",
        });
        return
    }

});

//Exportar a instrução da rota

export default router;