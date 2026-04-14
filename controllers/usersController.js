import User from "../models/User.js";
import Role from "../models/roles.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Récupérer tous les utilisateurs avec leur rôle
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un utilisateur par son id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Role
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({ data: user })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter un nouvel utilisateur
export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  try {
    const mdpHache=bcrypt.hashSync(password, 10)
    const { nom, email, password, roleId } = req.body
    const newUser = { nom, email, password: mdpHache, roleId}

    const user = await User.create(newUser)

    res.status(201).json({ message: "Utilisateur ajouté avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un utilisateur par son id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User introuvable" });
    }

    await user.update({
      nom: req.body.nom,
      email: req.body.email,
      password: req.body.password,
      roleId: req.body.roleId
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un utilisateur par son id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User introuvable" });
    }

    await user.destroy();
    res.status(200).json({ message: "User supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};