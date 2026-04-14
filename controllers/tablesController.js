import Table from "../models/Tables.js";

// Récupérer toutes les tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une table par son id
export const getTableById = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table introuvable" });
    }

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une nouvelle table
export const createTable = async (req, res) => {
  try {
    const table = await Table.create({
      capacite: req.body.capacite,
      disponibilite: req.body.disponibilite
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une table par son id
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table introuvable" });
    }

    await table.update({
      capacite: req.body.capacite,
      disponibilite: req.body.disponibilite
    });

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une table par son id
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table introuvable" });
    }

    await table.destroy();
    res.status(200).json({ message: "Table supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};