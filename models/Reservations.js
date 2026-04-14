import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Client from "./Clients.js";
import Table from "./Tables.js";

const Reservation = sequelize.define("reservations", {
  id_reservation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_reservation: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  heure_reservation: {
    type: DataTypes.TIME,
    allowNull: false
  },
  nombre_personnes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: "id_client"
    }
  },
  id_table: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Table,
      key: "id_table"
    }
  }
}, {
  timestamps: false
});

Client.hasMany(Reservation, { foreignKey: "id_client" });
Reservation.belongsTo(Client, { foreignKey: "id_client" });

Table.hasMany(Reservation, { foreignKey: "id_table" });
Reservation.belongsTo(Table, { foreignKey: "id_table" });

export default Reservation;