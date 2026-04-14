import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Categories.js";

const Menu = sequelize.define("menu", {
  id_menu: {
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
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image_plat: {
    type: DataTypes.STRING(150)
  },
  id_categorie: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: "id_categorie"
    }
  }
}, {
  timestamps: false
});

Category.hasMany(Menu, { foreignKey: "id_categorie" });
Menu.belongsTo(Category, { foreignKey: "id_categorie" });

export default Menu;