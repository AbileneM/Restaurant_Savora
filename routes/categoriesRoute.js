import { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoriesController.js";
import upload from "../helpers/fileLoader.js";

const categoriesRoute = Router();

categoriesRoute.get('/', getAllCategories)
            .get('/:id', getCategoryById)
            .post('/', upload.single('image'), createCategory)
            .put('/:id', upload.single('image'), updateCategory)
            .delete('/:id', deleteCategory);

export default categoriesRoute;