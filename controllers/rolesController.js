import Role from "../models/roles.js";

import { validationResult } from "express-validator";

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un rôle par son id
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role introuvable" });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un nouveau rôle
export const createRole = async (req, res) => {
  try {
    const role = await Role.create({
      name: req.body.name
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un rôle par son id
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role introuvable" });
    }

    await role.update({
      name: req.body.name
    });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un rôle par son id
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role introuvable" });
    }

    await role.destroy();
    res.status(200).json({ message: "Role supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};