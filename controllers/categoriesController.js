import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Category } from '../models/Relation.js';

//1-Liste des catégories
export const getAllCategories = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = paginate(page, size)
    try {
        const { rows: categories, count: total } = await Category.findAndCountAll({ limit, offset });
        const currentPage = +page;
        const totalPages = total ? Math.ceil(total / limit) : 1;
            
        res.status(200).json({data: {categories, total, currentPage, totalPages}});
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
};

//2-Ajouter une catégorie

// Récupérer une catégorie par son id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categorie introuvable" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      nom: req.body.nom,
      description: req.body.description
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une catégorie par son id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categorie introuvable" });
    }

    await category.update({
      nom: req.body.nom,
      description: req.body.description
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une catégorie par son id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categorie introuvable" });
    }

    await category.destroy();
    res.status(200).json({ message: "Categorie supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};