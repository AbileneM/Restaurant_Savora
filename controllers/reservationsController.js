import Reservation from "../models/Reservations.js";
import Client from "../models/Clients.js";
import Table from "../models/Tables.js";

// Récupérer toutes les réservations avec client et table
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [Client, Table]
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une réservation par son id
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [Client, Table]
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation introuvable" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une nouvelle réservation
export const createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create({
      date_reservation: req.body.date_reservation,
      heure_reservation: req.body.heure_reservation,
      nombre_personnes: req.body.nombre_personnes,
      id_client: req.body.id_client,
      id_table: req.body.id_table
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une réservation par son id
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation introuvable" });
    }

    await reservation.update({
      date_reservation: req.body.date_reservation,
      heure_reservation: req.body.heure_reservation,
      nombre_personnes: req.body.nombre_personnes,
      id_client: req.body.id_client,
      id_table: req.body.id_table
    });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une réservation par son id
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation introuvable" });
    }

    await reservation.destroy();
    res.status(200).json({ message: "Reservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};