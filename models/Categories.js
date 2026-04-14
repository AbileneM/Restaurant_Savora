import connection from "../config/db.js";
import { DataTypes } from "sequelize";


const Categorie = connection.define("categories", {
    id_categorie: { type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "categories",
    timestamps: false
  }
);

export default Categorie;