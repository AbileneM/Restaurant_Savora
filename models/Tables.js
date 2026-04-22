import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Table = sequelize.define("tables", {
  id_table: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_table: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  capacite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disponibilite: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: false
});

export default Table;
