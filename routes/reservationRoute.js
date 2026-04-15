import { Router } from "express";
import { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation} from "../controllers/reservationsController";

const reservationRoute = Router();

reservationRoute.get('/', getAllReservations)
            .get('/:id', getReservationById)
            .post('/', createReservation)
            .put('/:id', updateReservation)
            .delete('/:id', deleteReservation);

export default reservationRoute;