import { Router } from "express";
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from "../controllers/rolesController.js";

const roleRoute = Router();

roleRoute.get('/', getAllRoles)
            .get('/:id', getRoleById)
            .post('/', createRole)
            .put('/:id', updateRole)
            .delete('/:id', deleteRole);

export default roleRoute;