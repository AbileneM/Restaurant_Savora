import { Router } from "express";
import { getAllTables, getTableById, createTable, updateTable, deleteTable } from "../controllers/tablesController.js";

const tableRoute = Router();

// Routes pour les tables
tableRoute.get("/", getAllTables)
        .get("/:id", getTableById)
        .post("/", createTable)
        .put("/:id", updateTable)
        .delete("/:id", deleteTable);

export default tableRoute;