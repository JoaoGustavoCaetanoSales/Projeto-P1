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
const Situations_1 = require("../entity/Situations");
const Users_1 = require("../entity/Users");
const router = express_1.default.Router();
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
            res.status(400).json({ messagem: "Página e limite devem ser números positivos!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const [users, totalRecords] = yield repository.findAndCount({
            relations: { situation: true },
            order: { id: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        res.status(200).json({
            error: false,
            data: users,
            currentPage: page,
            lastPage: Math.ceil(totalRecords / limit),
            totalRecords,
        });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao listar usuários!" });
    }
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ messagem: "ID de usuário inválido!" });
            return;
        }
        const user = yield data_source_1.AppDataSource.getRepository(Users_1.User).findOne({
            where: { id },
            relations: { situation: true },
        });
        if (!user) {
            res.status(404).json({ messagem: "Usuário não encontrado!" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao visualizar usuário!" });
    }
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, situationId } = req.body;
        const parsedSituationId = Number(situationId);
        if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || !Number.isInteger(parsedSituationId) || parsedSituationId < 1) {
            res.status(400).json({ messagem: "Informe name, email e situationId válidos!" });
            return;
        }
        const situation = yield data_source_1.AppDataSource.getRepository(Situations_1.Situation).findOneBy({ id: parsedSituationId });
        if (!situation) {
            res.status(404).json({ messagem: "Situação não encontrada!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = repository.create({ name: name.trim(), email: email.trim(), situation });
        yield repository.save(user);
        res.status(201).json({ messagem: "Usuário cadastrado com sucesso!", user });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar usuário! Verifique se o e-mail já está cadastrado." });
    }
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ messagem: "ID de usuário inválido!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = yield repository.findOne({ where: { id }, relations: { situation: true } });
        if (!user) {
            res.status(404).json({ messagem: "Usuário não encontrado!" });
            return;
        }
        const { name, email, situationId } = req.body;
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                res.status(400).json({ messagem: "Informe um name válido!" });
                return;
            }
            user.name = name.trim();
        }
        if (email !== undefined) {
            if (typeof email !== "string" || !email.trim()) {
                res.status(400).json({ messagem: "Informe um email válido!" });
                return;
            }
            user.email = email.trim();
        }
        if (situationId !== undefined) {
            const parsedSituationId = Number(situationId);
            if (!Number.isInteger(parsedSituationId) || parsedSituationId < 1) {
                res.status(400).json({ messagem: "Informe um situationId válido!" });
                return;
            }
            const situation = yield data_source_1.AppDataSource.getRepository(Situations_1.Situation).findOneBy({ id: parsedSituationId });
            if (!situation) {
                res.status(404).json({ messagem: "Situação não encontrada!" });
                return;
            }
            user.situation = situation;
        }
        yield repository.save(user);
        res.status(200).json({ messagem: "Usuário atualizado com sucesso!", user });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar usuário! Verifique se o e-mail já está cadastrado." });
    }
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({ messagem: "ID de usuário inválido!" });
            return;
        }
        const repository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = yield repository.findOneBy({ id });
        if (!user) {
            res.status(404).json({ messagem: "Usuário não encontrado!" });
            return;
        }
        yield repository.remove(user);
        res.status(200).json({ messagem: "Usuário excluído com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ messagem: "Erro ao excluir usuário!" });
    }
}));
exports.default = router;
