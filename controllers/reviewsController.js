import Review from "../models/Reviews.js";
import Client from "../models/Clients.js";

// Récupérer tous les avis avec leur client
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: Client
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un avis par son id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: Client
    });

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un nouvel avis
export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      note: req.body.note,
      commentaire: req.body.commentaire,
      id_client: req.body.id_client
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un avis par son id
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    await review.update({
      note: req.body.note,
      commentaire: req.body.commentaire,
      id_client: req.body.id_client
    });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un avis par son id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable" });
    }

    await review.destroy();
    res.status(200).json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};