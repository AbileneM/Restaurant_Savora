import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Client = sequelize.define("clients", {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING(30)
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

export default Client;