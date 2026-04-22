//Importer tous les modules installes
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

import database from './config/db.js';
import route from "./routes/userRoute.js";

//Importation des routes
import authRoute from "./routes/authRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import menuRoute from "./routes/menuRoute.js";
import clientsRoute from "./routes/clientsRoute.js";
import tableRoute from "./routes/tableRoute.js";
import reservationsRoute from "./routes/reservationRoute.js";
import reviewsRoute from "./routes/reviewRoute.js";
import rolesRoute from "./routes/roleRoute.js";
import userWebRoute from "./routes/userWebRoute.js";


const app = express();

//Utilisation des middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Utilisation de EJS
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "savora-dev-session-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.set('view engine', 'ejs')
app.set('views', './views')

//Creation des tables dans la base de données
//database.sync({ alter: true })
   // .then(() => console.log('La base de données a été synchronisée avec succès.'))
    //.catch((error) => console.error('Erreur lors de la synchronisation de la base de données :', error));


//Vue d'accueil
app.get('/', (req, res) => res.render('index'));
app.get('/menu', (req, res) => {
  res.render('menu');
});
app.get('/reviews', (req, res) => {
  res.render('reviews');
});
app.get('/table', (req, res) => {
  res.render('table');
});

app.get('/login', (req, res) => {
  res.render('login');
});

//Les routes
app.use("/api/auth", authRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/menu", menuRoute);
app.use("/api/clients", clientsRoute);
app.use("/api/tables", tableRoute);
app.use("/api/reservations", reservationsRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/roles", rolesRoute);
app.use("/api/users", route);

//Routes EJS
app.use("/users", userWebRoute);


app.use('/public', express.static('public'))

//Demarrage du serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
