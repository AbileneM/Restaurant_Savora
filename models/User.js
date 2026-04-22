import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Création du modèle users
const User = sequelize.define("users", {
  // Clé primaire de la table users
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Nom de l'utilisateur
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Email de l'utilisateur
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // Mot de passe de l'utilisateur
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

}, {
  // Désactive createdAt et updatedAt
  timestamps: false
});

export default User;
