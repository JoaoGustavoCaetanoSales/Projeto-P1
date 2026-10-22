import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { ProductCategory } from "../entity/ProductCategory";
import { ProductSituation } from "../entity/ProductSituation";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });
    const products = await repository.find({
      where: result.data.map((product) => ({ id: product.id })),
      relations: { productSituation: true, productCategory: true },
      order: { id: "DESC" },
    });

    res.status(200).json({ ...result, data: products });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao listar produtos!" });
  }
});

router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id },
      relations: { productSituation: true, productCategory: true },
    });

    if (!product) {
      res.status(404).json({ messagem: "Produto não encontrado!" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao visualizar produto!" });
  }
});

router.post("/products", async (req: Request, res: Response) => {
  try {
    const { name, productSituationId, productCategoryId } = req.body;

    if (typeof name !== "string" || !name.trim() || !Number.isInteger(Number(productSituationId)) || !Number.isInteger(Number(productCategoryId))) {
      res.status(400).json({ messagem: "Informe name, productSituationId e productCategoryId válidos!" });
      return;
    }

    const situationRepository = AppDataSource.getRepository(ProductSituation);
    const categoryRepository = AppDataSource.getRepository(ProductCategory);
    const productSituation = await situationRepository.findOneBy({ id: Number(productSituationId) });
    const productCategory = await categoryRepository.findOneBy({ id: Number(productCategoryId) });

    if (!productSituation || !productCategory) {
      res.status(404).json({ messagem: "Situação ou categoria do produto não encontrada!" });
      return;
    }

    const repository = AppDataSource.getRepository(Product);
    const product = repository.create({ name: name.trim(), productSituation, productCategory });
    await repository.save(product);

    res.status(201).json({ messagem: "Produto cadastrado com sucesso!", product });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao cadastrar produto!" });
  }
});

router.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repository = AppDataSource.getRepository(Product);
    const product = await repository.findOne({
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
      const productSituation = await AppDataSource.getRepository(ProductSituation).findOneBy({ id: Number(productSituationId) });
      if (!Number.isInteger(Number(productSituationId)) || !productSituation) {
        res.status(404).json({ messagem: "Situação do produto não encontrada!" });
        return;
      }
      product.productSituation = productSituation;
    }

    if (productCategoryId !== undefined) {
      const productCategory = await AppDataSource.getRepository(ProductCategory).findOneBy({ id: Number(productCategoryId) });
      if (!Number.isInteger(Number(productCategoryId)) || !productCategory) {
        res.status(404).json({ messagem: "Categoria do produto não encontrada!" });
        return;
      }
      product.productCategory = productCategory;
    }

    const updatedProduct = await repository.save(product);
    res.status(200).json({ messagem: "Produto atualizado com sucesso!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao atualizar produto!" });
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const product = await repository.findOneBy({ id: Number(req.params.id) });

    if (!product) {
      res.status(404).json({ messagem: "Produto não encontrado!" });
      return;
    }

    await repository.remove(product);
    res.status(200).json({ messagem: "Produto excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ messagem: "Erro ao excluir produto!" });
  }
});

export default router;