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
const Products_1 = require("../entity/Products");
const ProductCategory_1 = require("../entity/ProductCategory");
const ProductSituation_1 = require("../entity/ProductSituation");
const PaginationService_1 = require("../services/PaginationService");
const router = express_1.default.Router();
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = yield PaginationService_1.PaginationService.paginate(repository, page, limit, { id: "DESC" });
        const products = yield repository.find({
            where: result.data.map((product) => ({ id: product.id })),
            relations: { productSituation: true, productCategory: true },
            order: { id: "DESC" },
        });
        res.status(200).json(Object.assign(Object.assign({}, result), { data: products }));
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao listar produtos!" });
    }
}));
router.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const product = yield data_source_1.AppDataSource.getRepository(Products_1.Product).findOne({
            where: { id },
            relations: { productSituation: true, productCategory: true },
        });
        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao visualizar produto!" });
    }
}));
router.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, productSituationId, productCategoryId } = req.body;
        if (typeof name !== "string" || !name.trim() || !Number.isInteger(Number(productSituationId)) || !Number.isInteger(Number(productCategoryId))) {
            res.status(400).json({ messagem: "Informe name, productSituationId e productCategoryId válidos!" });
            return;
        }
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const categoryRepository = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const productSituation = yield situationRepository.findOneBy({ id: Number(productSituationId) });
        const productCategory = yield categoryRepository.findOneBy({ id: Number(productCategoryId) });
        if (!productSituation || !productCategory) {
            res.status(404).json({ messagem: "Situação ou categoria do produto não encontrada!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = repository.create({ name: name.trim(), productSituation, productCategory });
        yield repository.save(product);
        res.status(201).json({ messagem: "Produto cadastrado com sucesso!", product });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar produto!" });
    }
}));
router.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const repository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = yield repository.findOne({
            where: { id },
            relations: { productSituation: true, productCategory: true },
        });
        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }
        const { name, productSituationId, productCategoryId } = req.body;
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                res.status(400).json({ messagem: "Informe um name válido!" });
                return;
            }
            product.name = name.trim();
        }
        if (productSituationId !== undefined) {
            const productSituation = yield data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation).findOneBy({ id: Number(productSituationId) });
            if (!Number.isInteger(Number(productSituationId)) || !productSituation) {
                res.status(404).json({ messagem: "Situação do produto não encontrada!" });
                return;
            }
            product.productSituation = productSituation;
        }
        if (productCategoryId !== undefined) {
            const productCategory = yield data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory).findOneBy({ id: Number(productCategoryId) });
            if (!Number.isInteger(Number(productCategoryId)) || !productCategory) {
                res.status(404).json({ messagem: "Categoria do produto não encontrada!" });
                return;
            }
            product.productCategory = productCategory;
        }
        const updatedProduct = yield repository.save(product);
        res.status(200).json({ messagem: "Produto atualizado com sucesso!", product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar produto!" });
    }
}));
router.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = yield repository.findOneBy({ id: Number(req.params.id) });
        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }
        yield repository.remove(product);
        res.status(200).json({ messagem: "Produto excluído com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao excluir produto!" });
    }
}));
exports.default = router;
