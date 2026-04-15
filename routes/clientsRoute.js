import { Router } from "express";
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from "../controllers/clientsController.js";

const clientsRoute = Router();

clientsRoute.get('/', getAllClients)
            .get('/:id', getClientById)
            .post('/', createClient)
            .put('/:id', updateClient)
            .delete('/:id', deleteClient);

export default clientsRoute;