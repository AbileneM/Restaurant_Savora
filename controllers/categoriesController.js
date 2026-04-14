import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import Categorie from '../models/Categories.js';

//1-Liste des catégories
export const getAllCategories = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = paginate(page, size)
    try {
        const { rows: categories, count: total } = await Categorie.findAndCountAll({ limit, offset });
        const currentPage = +page;
        const totalPages = total ? Math.ceil(total / limit) : 1;
            
        res.status(200).json({data: {categories, total, currentPage, totalPages}});
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
};

//2-Ajouter une catégorie

export const getCategorieById = async (req, res) => {
    const { id } = req.params 
    try {
        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({message: 'La catégorie n\'a pas été trouvée.'});
        }
        res.status(200).json({data: categorie});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Créer une catégorie
export const createCategorie = async (req, res) => {
    const { nom, description } = req.body;
    try {
        const newCategorie = await Categorie.create({ nom, description });
        res.status(201).json({data: newCategorie});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Mettre à jour une catégorie
export const updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { nom, description } = req.body;
    try {
        const categorie = await Categorie.findByPk(id);
        if (!categorie) {
            return res.status(404).json({message: 'La catégorie n\'a pas été trouvée.'});
        }
        await categorie.update({ nom, description });
        res.status(200).json({data: categorie});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

//Supprimer une catégorie
export const deleteCategorie = async (req, res) => {
    const { id } = req.params;
    try {
        await Categorie.destroy({where: { id_categorie: id }});
        res.status(200).json({message: 'La catégorie a été supprimée avec succès.'});
        }
         catch (error) {
        res.status(400).json({message: error.message});
    }
};