import { Router } from "express";
import { Client, Reservation, Table } from "../models/Relation.js";

const reservationWebRoute = Router();

const loadTables = () => Table.findAll({
  where: { disponibilite: true },
  order: [["capacite", "ASC"], ["numero_table", "ASC"], ["id_table", "ASC"]]
});

const renderReservation = async (res, status, options) => res.status(status).render("reservation", {
  title: "Reservation",
  tables: await loadTables(),
  form: options.form || {},
  success: options.success || null,
  error: options.error || null
});

reservationWebRoute.get("/", async (req, res) => {
  renderReservation(res, 200, {
    form: {}
  });
});

reservationWebRoute.post("/", async (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    email,
    date_reservation,
    heure_reservation,
    nombre_personnes,
    id_table
  } = req.body;

  if (!nom?.trim() || !prenom?.trim() || !email?.trim() || !date_reservation || !heure_reservation || !nombre_personnes || !id_table) {
    return renderReservation(res, 400, {
      form: req.body,
      error: "Veuillez remplir tous les champs obligatoires."
    });
  }

  try {
    const table = await Table.findByPk(id_table);

    if (!table) {
      return renderReservation(res, 400, {
        form: req.body,
        error: "La table selectionnee est introuvable."
      });
    }

    if (!table.disponibilite) {
      return renderReservation(res, 400, {
        form: req.body,
        error: "La table selectionnee n'est pas disponible."
      });
    }

    if (Number(nombre_personnes) > Number(table.capacite)) {
      return renderReservation(res, 400, {
        form: req.body,
        error: "La table selectionnee n'a pas assez de places."
      });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        id_table,
        date_reservation,
        heure_reservation
      }
    });

    if (existingReservation) {
      return renderReservation(res, 400, {
        form: req.body,
        error: "Cette table est deja reservee pour cette date et cette heure."
      });
    }

    const [client] = await Client.findOrCreate({
      where: { email: email.trim() },
      defaults: {
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone?.trim() || null
      }
    });

    await client.update({
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: telephone?.trim() || client.telephone
    });

    await Reservation.create({
      date_reservation,
      heure_reservation,
      nombre_personnes,
      id_client: client.id_client,
      id_table
    });

    renderReservation(res, 200, {
      form: {},
      success: "Votre reservation a ete enregistree avec succes.",
    });
  } catch (error) {
    renderReservation(res, 400, {
      form: req.body,
      error: error.message
    });
  }
});

export default reservationWebRoute;
