import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { User } from "../entity/Users";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      res.status(400).json({ messagem: "Página e limite devem ser números positivos!" });
      return;
    }

    const repository = AppDataSource.getRepository(User);
    const [users, totalRecords] = await repository.findAndCount({
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
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao listar usuários!" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ messagem: "ID de usuário inválido!" });
      return;
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id },
      relations: { situation: true },
    });

    if (!user) {
      res.status(404).json({ messagem: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao visualizar usuário!" });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, situationId } = req.body;
    const parsedSituationId = Number(situationId);

    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || !Number.isInteger(parsedSituationId) || parsedSituationId < 1) {
      res.status(400).json({ messagem: "Informe name, email e situationId válidos!" });
      return;
    }

    const situation = await AppDataSource.getRepository(Situation).findOneBy({ id: parsedSituationId });
    if (!situation) {
      res.status(404).json({ messagem: "Situação não encontrada!" });
      return;
    }

    const repository = AppDataSource.getRepository(User);
    const user = repository.create({ name: name.trim(), email: email.trim(), situation });
    await repository.save(user);

    res.status(201).json({ messagem: "Usuário cadastrado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao cadastrar usuário! Verifique se o e-mail já está cadastrado." });
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ messagem: "ID de usuário inválido!" });
      return;
    }

    const repository = AppDataSource.getRepository(User);
    const user = await repository.findOne({ where: { id }, relations: { situation: true } });
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

      const situation = await AppDataSource.getRepository(Situation).findOneBy({ id: parsedSituationId });
      if (!situation) {
        res.status(404).json({ messagem: "Situação não encontrada!" });
        return;
      }
      user.situation = situation;
    }

    await repository.save(user);
    res.status(200).json({ messagem: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao atualizar usuário! Verifique se o e-mail já está cadastrado." });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ messagem: "ID de usuário inválido!" });
      return;
    }

    const repository = AppDataSource.getRepository(User);
    const user = await repository.findOneBy({ id });
    if (!user) {
      res.status(404).json({ messagem: "Usuário não encontrado!" });
      return;
    }

    await repository.remove(user);
    res.status(200).json({ messagem: "Usuário excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao excluir usuário!" });
  }
});

export default router;