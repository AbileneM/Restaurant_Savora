import { Router } from "express";
import { Client, Review } from "../models/Relation.js";

const reviewWebRoute = Router();

const loadReviews = () => Review.findAll({
  include: Client,
  order: [["date_review", "DESC"], ["id_review", "DESC"]]
});

reviewWebRoute.get("/", async (req, res) => {
  res.render("reviews", {
    title: "Reviews",
    reviews: await loadReviews(),
    form: {},
    success: null,
    error: null
  });
});

reviewWebRoute.post("/", async (req, res) => {
  const { nom, prenom, email, note, commentaire } = req.body;

  if (!nom?.trim() || !prenom?.trim() || !email?.trim() || !note) {
    return res.status(400).render("reviews", {
      title: "Reviews",
      reviews: await loadReviews(),
      form: req.body,
      success: null,
      error: "Veuillez remplir le nom, le prenom, l'email et la note."
    });
  }

  if (Number(note) < 1 || Number(note) > 5) {
    return res.status(400).render("reviews", {
      title: "Reviews",
      reviews: await loadReviews(),
      form: req.body,
      success: null,
      error: "La note doit etre entre 1 et 5."
    });
  }

  try {
    const [client] = await Client.findOrCreate({
      where: { email: email.trim() },
      defaults: {
        nom: nom.trim(),
        prenom: prenom.trim()
      }
    });

    await client.update({
      nom: nom.trim(),
      prenom: prenom.trim()
    });

    await Review.create({
      note,
      commentaire: commentaire?.trim() || null,
      id_client: client.id_client
    });

    res.render("reviews", {
      title: "Reviews",
      reviews: await loadReviews(),
      form: {},
      success: "Merci pour votre avis.",
      error: null
    });
  } catch (error) {
    res.status(400).render("reviews", {
      title: "Reviews",
      reviews: await loadReviews(),
      form: req.body,
      success: null,
      error: error.message
    });
  }
});

export default reviewWebRoute;
