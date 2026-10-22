import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategory";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

router.get("/product-categories", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductCategory);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    res.status(200).json(await PaginationService.paginate(repository, page, limit, { id: "DESC" }));
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao listar categorias de produtos!" });
  }
});

router.get("/product-categories/:id", async (req: Request, res: Response) => {
  try {
    const category = await AppDataSource.getRepository(ProductCategory).findOneBy({ id: Number(req.params.id) });
    if (!category) {
      res.status(404).json({ messagem: "Categoria de produto não encontrada!" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao visualizar categoria de produto!" });
  }
});

router.post("/product-categories", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ messagem: "Informe um name válido!" });
      return;
    }
    const repository = AppDataSource.getRepository(ProductCategory);
    const category = repository.create({ name: name.trim() });
    await repository.save(category);
    res.status(201).json({ messagem: "Categoria de produto cadastrada com sucesso!", category });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao cadastrar categoria de produto!" });
  }
});

router.put("/product-categories/:id", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductCategory);
    const category = await repository.findOneBy({ id: Number(req.params.id) });
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
    await repository.save(category);
    res.status(200).json({ messagem: "Categoria de produto atualizada com sucesso!", category });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao atualizar categoria de produto!" });
  }
});

router.delete("/product-categories/:id", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(ProductCategory);
    const category = await repository.findOneBy({ id: Number(req.params.id) });
    if (!category) {
      res.status(404).json({ messagem: "Categoria de produto não encontrada!" });
      return;
    }
    await repository.remove(category);
    res.status(200).json({ messagem: "Categoria de produto excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao excluir categoria de produto!" });
  }
});

export default router;