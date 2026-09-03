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
const data_source_1 = require("../data-source");
const Situations_1 = require("../entity/Situations");
// Criar a Aplicação Express
const router = express_1.default.Router();
//Criar a LISTA
router.get("/situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const situations = yield situationRepository.find();
        res.status(200).json(situations);
        return;
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar situação!",
        });
        return;
    }
}));
//Criar a Visualização do item cadastrado em situação
router.get("/situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const situations = yield situationRepository.findOneBy({ id: parseInt(id, 10) });
        if (!situations) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        res.status(200).json(situations);
        return;
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar situação!",
        });
        return;
    }
}));
//Criar a rota POST
router.post("/situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const newSituation = situationRepository.create(data);
        yield situationRepository.save(newSituation);
        res.status(201).json({
            messagem: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao cadastrar situação!",
        });
    }
}));
//Exportar a instrução da rota
exports.default = router;
