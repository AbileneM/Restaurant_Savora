import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./roles.js";

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

  // Clé étrangère qui relie users à roles
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id_role"
    }
  }
}, {
  // Désactive createdAt et updatedAt
  timestamps: false
});

export default User;