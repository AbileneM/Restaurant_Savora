import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

const userRoute = Router();

// Routes pour les utilisateurs
userRoute.get("/", getAllUsers)
        .get("/:id", getUserById)
        .post("/", createUser)
        .put("/:id", updateUser)
        .delete("/:id", deleteUser);

export default userRoute;