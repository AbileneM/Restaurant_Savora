import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("categories", {
  id_categorie: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
});

export default Category;