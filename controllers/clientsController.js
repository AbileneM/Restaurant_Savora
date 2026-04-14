import Client from "../models/Clients.js";

// Récupérer tous les clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un client par son id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un nouveau client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      telephone: req.body.telephone,
      email: req.body.email
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un client par son id
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    await client.update({
      nom: req.body.nom,
      prenom: req.body.prenom,
      telephone: req.body.telephone,
      email: req.body.email
    });

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un client par son id
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    await client.destroy();
    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};