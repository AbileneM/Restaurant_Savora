import { Router } from "express";
import { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu } from "../controllers/menuController";

const menuRoute = Router();

menuRoute.get('/', getAllMenus)
            .get('/:id', getMenuById)
            .post('/', createMenu)
            .put('/:id', updateMenu)
            .delete('/:id', deleteMenu);

export default menuRoute;