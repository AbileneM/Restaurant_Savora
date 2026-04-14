import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Client from "./Clients.js";

const Review = sequelize.define("reviews", {
  id_review: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  commentaire: {
    type: DataTypes.TEXT
  },
  date_review: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: "id_client"
    }
  }
}, {
  timestamps: false
});

Client.hasMany(Review, { foreignKey: "id_client" });
Review.belongsTo(Client, { foreignKey: "id_client" });

export default Review;