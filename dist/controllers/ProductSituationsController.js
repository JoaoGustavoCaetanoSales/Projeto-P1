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
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const ProductSituation_1 = require("../entity/ProductSituation");
const PaginationService_1 = require("../services/PaginationService");
const router = express_1.default.Router();
router.get("/product-situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        res.status(200).json(yield PaginationService_1.PaginationService.paginate(repository, page, limit, { id: "DESC" }));
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao listar situações de produtos!" });
    }
}));
router.get("/product-situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const situation = yield data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation).findOneBy({ id: Number(req.params.id) });
        if (!situation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }
        res.status(200).json(situation);
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao visualizar situação de produto!" });
    }
}));
router.post("/product-situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ messagem: "Informe um name válido!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const situation = repository.create({ name: name.trim() });
        yield repository.save(situation);
        res.status(201).json({ messagem: "Situação de produto cadastrada com sucesso!", situation });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar situação de produto!" });
    }
}));
router.put("/product-situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const situation = yield repository.findOneBy({ id: Number(req.params.id) });
        if (!situation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }
        const { name } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ messagem: "Informe um name válido!" });
            return;
        }
        situation.name = name.trim();
        yield repository.save(situation);
        res.status(200).json({ messagem: "Situação de produto atualizada com sucesso!", situation });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar situação de produto!" });
    }
}));
router.delete("/product-situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const situation = yield repository.findOneBy({ id: Number(req.params.id) });
        if (!situation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }
        yield repository.remove(situation);
        res.status(200).json({ messagem: "Situação de produto excluída com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao excluir situação de produto!" });
    }
}));
exports.default = router;
