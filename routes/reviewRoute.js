import { Router } from "express";
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from "../controllers/reviewsController.js";

const reviewRoute = Router();

reviewRoute.get('/', getAllReviews)
            .get('/:id', getReviewById)
            .post('/', createReview)
            .put('/:id', updateReview)
            .delete('/:id', deleteReview);

export default reviewRoute;