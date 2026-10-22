import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituation";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

router.get("/product-situations", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductSituation);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    res.status(200).json(await PaginationService.paginate(repository, page, limit, { id: "DESC" }));
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao listar situações de produtos!" });
  }
});

router.get("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    const situation = await AppDataSource.getRepository(ProductSituation).findOneBy({ id: Number(req.params.id) });
    if (!situation) {
      res.status(404).json({ messagem: "Situação de produto não encontrada!" });
      return;
    }
    res.status(200).json(situation);
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao visualizar situação de produto!" });
  }
});

router.post("/product-situations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ messagem: "Informe um name válido!" });
      return;
    }
    const repository = AppDataSource.getRepository(ProductSituation);
    const situation = repository.create({ name: name.trim() });
    await repository.save(situation);
    res.status(201).json({ messagem: "Situação de produto cadastrada com sucesso!", situation });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao cadastrar situação de produto!" });
  }
});

router.put("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductSituation);
    const situation = await repository.findOneBy({ id: Number(req.params.id) });
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
    await repository.save(situation);
    res.status(200).json({ messagem: "Situação de produto atualizada com sucesso!", situation });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao atualizar situação de produto!" });
  }
});

router.delete("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductSituation);
    const situation = await repository.findOneBy({ id: Number(req.params.id) });
    if (!situation) {
      res.status(404).json({ messagem: "Situação de produto não encontrada!" });
      return;
    }
    await repository.remove(situation);
    res.status(200).json({ messagem: "Situação de produto excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao excluir situação de produto!" });
  }
});

export default router;