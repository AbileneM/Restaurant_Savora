import User from "./User.js";
import Role from "./Role.js";
import Category from "./Categories.js";
import Client from "./Clients.js";
import Menu from "./Menu.js";
import Reservation from "./Reservations.js";
import Table from "./Tables.js";
import Review from "./Reviews.js";

//Relations entre les modèles

Category.hasMany(Menu, { foreignKey: "id_categorie" });
Menu.belongsTo(Category, { foreignKey: "id_categorie" });

Client.hasMany(Reservation, { foreignKey: "id_client" });
Reservation.belongsTo(Client, { foreignKey: "id_client" });

Table.hasMany(Reservation, { foreignKey: "id_table" });
Reservation.belongsTo(Table, { foreignKey: "id_table" });

Review.belongsTo(Client, { foreignKey: "id_client" });
Client.hasMany(Review, { foreignKey: "id_client" });

User.belongsToMany(Role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

Role.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});

export { User, Role, Category, Menu, Reservation, Client, Table, Review };