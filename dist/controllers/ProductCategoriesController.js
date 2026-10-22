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
const ProductCategory_1 = require("../entity/ProductCategory");
const PaginationService_1 = require("../services/PaginationService");
const router = express_1.default.Router();
router.get("/product-categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        res.status(200).json(yield PaginationService_1.PaginationService.paginate(repository, page, limit, { id: "DESC" }));
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao listar categorias de produtos!" });
    }
}));
router.get("/product-categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory).findOneBy({ id: Number(req.params.id) });
        if (!category) {
            res.status(404).json({ messagem: "Categoria de produto não encontrada!" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao visualizar categoria de produto!" });
    }
}));
router.post("/product-categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ messagem: "Informe um name válido!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const category = repository.create({ name: name.trim() });
        yield repository.save(category);
        res.status(201).json({ messagem: "Categoria de produto cadastrada com sucesso!", category });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar categoria de produto!" });
    }
}));
router.put("/product-categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const category = yield repository.findOneBy({ id: Number(req.params.id) });
        if (!category) {
            res.status(404).json({ messagem: "Categoria de produto não encontrada!" });
            return;
        }
        const { name } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ messagem: "Informe um name válido!" });
            return;
        }
        category.name = name.trim();
        yield repository.save(category);
        res.status(200).json({ messagem: "Categoria de produto atualizada com sucesso!", category });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar categoria de produto!" });
    }
}));
router.delete("/product-categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const category = yield repository.findOneBy({ id: Number(req.params.id) });
        if (!category) {
            res.status(404).json({ messagem: "Categoria de produto não encontrada!" });
            return;
        }
        yield repository.remove(category);
        res.status(200).json({ messagem: "Categoria de produto excluída com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao excluir categoria de produto!" });
    }
}));
exports.default = router;
