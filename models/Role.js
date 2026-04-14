import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define("roles", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false
});

export default Role;