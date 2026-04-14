//Importer tous les modules installes
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
dotenv.config();

import database from './config/db.js';

//Importation des controllers roles
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from './controllers/rolesController.js';

//Importation des controllers users
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './controllers/usersController.js';

//Importation des controllers categories
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from './controllers/categoriesController.js';

//Importation des controllers menu
import { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu } from './controllers/menuController.js';

//Importation des controllers clients
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from './controllers/clientsController.js';

//Importation des controllers tables
import { getAllTables, getTableById, createTable, updateTable, deleteTable } from './controllers/tablesController.js';

//Importation des controllers reservations
import { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation } from './controllers/reservationsController.js';

//Importation des controllers reviews
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from './controllers/reviewsController.js';

//Importation des validations et login
import userValidator  from './validations/userValidation.js';
import { login } from './auth/loginControllers.js';

//Creation de l'application express
const app = express();

//Utilisation des middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Creation des tables dans la base de données
database.sync({ alter: true })
    .then(() => console.log('La base de données a été synchronisée avec succès.'))
    .catch((error) => console.error('Erreur lors de la synchronisation de la base de données :', error));

//Création de notre premiere route
app.get('/', (req, res) => res.send('Bienvenue sur notre API de restaurant !'));

//Routes roles
app.get('/api/roles', getAllRoles);
app.get('/api/roles/:id', getRoleById);
app.post('/api/roles', createRole);
app.put('/api/roles/:id', updateRole);
app.delete('/api/roles/:id', deleteRole);

//Routes users
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUserById);
app.post('/api/users', userValidator, createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

//Routes categories
app.get('/api/categories', getAllCategories);
app.get('/api/categories/:id', getCategoryById);
app.post('/api/categories', createCategory);
app.put('/api/categories/:id', updateCategory);
app.delete('/api/categories/:id', deleteCategory);

//Routes menu
app.get('/api/menu', getAllMenus);
app.get('/api/menu/:id', getMenuById);
app.post('/api/menu', createMenu);
app.put('/api/menu/:id', updateMenu);
app.delete('/api/menu/:id', deleteMenu);

//Routes clients
app.get('/api/clients', getAllClients);
app.get('/api/clients/:id', getClientById);
app.post('/api/clients', createClient);
app.put('/api/clients/:id', updateClient);
app.delete('/api/clients/:id', deleteClient);

//Routes tables
app.get('/api/tables', getAllTables);
app.get('/api/tables/:id', getTableById);
app.post('/api/tables', createTable);
app.put('/api/tables/:id', updateTable);
app.delete('/api/tables/:id', deleteTable);

//Routes reservations
app.get('/api/reservations', getAllReservations);
app.get('/api/reservations/:id', getReservationById);
app.post('/api/reservations', createReservation);
app.put('/api/reservations/:id', updateReservation);
app.delete('/api/reservations/:id', deleteReservation);

//Routes reviews
app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:id', getReviewById);
app.post('/api/reviews', createReview);
app.put('/api/reviews/:id', updateReview);
app.delete('/api/reviews/:id', deleteReview);

//Route login
app.post('/api/login', userValidator, login);

//Demarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Le serveur a demarre sur le port ${PORT}`));