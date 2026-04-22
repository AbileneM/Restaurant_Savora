import { Router } from "express";
import { Client, Reservation, Table } from "../models/Relation.js";

const reservationWebRoute = Router();

const loadTables = () => Table.findAll({
  order: [["capacite", "ASC"], ["id_table", "ASC"]]
});

reservationWebRoute.get("/", async (req, res) => {
  res.render("reservation", {
    title: "Reservation",
    tables: await loadTables(),
    form: {},
    success: null,
    error: null
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

  const tables = await loadTables();

  if (!nom?.trim() || !prenom?.trim() || !email?.trim() || !date_reservation || !heure_reservation || !nombre_personnes || !id_table) {
    return res.status(400).render("reservation", {
      title: "Reservation",
      tables,
      form: req.body,
      success: null,
      error: "Veuillez remplir tous les champs obligatoires."
    });
  }

  try {
    const table = await Table.findByPk(id_table);

    if (!table) {
      return res.status(400).render("reservation", {
        title: "Reservation",
        tables,
        form: req.body,
        success: null,
        error: "La table selectionnee est introuvable."
      });
    }

    if (Number(nombre_personnes) > Number(table.capacite)) {
      return res.status(400).render("reservation", {
        title: "Reservation",
        tables,
        form: req.body,
        success: null,
        error: "La table selectionnee n'a pas assez de places."
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

    res.render("reservation", {
      title: "Reservation",
      tables: await loadTables(),
      form: {},
      success: "Votre reservation a ete enregistree avec succes.",
      error: null
    });
  } catch (error) {
    res.status(400).render("reservation", {
      title: "Reservation",
      tables,
      form: req.body,
      success: null,
      error: error.message
    });
  }
});

export default reservationWebRoute;
