import { Router } from "express";
import { Role, User } from "../models/Relation.js";

const roleWebRoute = Router();

roleWebRoute.get("/", async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [["id_role", "ASC"]] });
    res.render("roles/role-list", {
      title: "Gestion des roles",
      roles,
      error: null
    });
  } catch (error) {
    res.status(500).render("roles/role-list", {
      title: "Gestion des roles",
      roles: [],
      error: error.message
    });
  }
});

roleWebRoute.get("/add", (req, res) => {
  res.render("roles/add-role", {
    title: "Ajouter un role",
    role: {},
    error: null
  });
});

roleWebRoute.post("/", async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).render("roles/add-role", {
      title: "Ajouter un role",
      role: req.body,
      error: "Le nom du role est obligatoire."
    });
  }

  try {
    await Role.create({ name });
    res.redirect("/roles");
  } catch (error) {
    res.status(400).render("roles/add-role", {
      title: "Ajouter un role",
      role: req.body,
      error: error.message
    });
  }
});

roleWebRoute.get("/edit/:id", async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).redirect("/roles");
    }

    res.render("roles/edit-role", {
      title: "Modifier un role",
      role,
      error: null
    });
  } catch (error) {
    res.status(500).redirect("/roles");
  }
});

roleWebRoute.put("/:id", async (req, res) => {
  const name = req.body.name?.trim();

  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).redirect("/roles");
    }

    if (!name) {
      return res.status(400).render("roles/edit-role", {
        title: "Modifier un role",
        role,
        error: "Le nom du role est obligatoire."
      });
    }

    await role.update({ name });
    res.redirect("/roles");
  } catch (error) {
    const role = await Role.findByPk(req.params.id);

    res.status(400).render("roles/edit-role", {
      title: "Modifier un role",
      role,
      error: error.message
    });
  }
});

roleWebRoute.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (role) {
      await role.destroy();
    }

    res.redirect("/roles");
  } catch (error) {
    const roles = await Role.findAll({ order: [["id_role", "ASC"]] });

    res.status(400).render("roles/role-list", {
      title: "Gestion des roles",
      roles,
      error: error.message
    });
  }
});

roleWebRoute.get("/:id/users", async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: {
        model: User,
        through: { attributes: [] },
        attributes: { exclude: ["password"] }
      }
    });

    if (!role) {
      return res.status(404).redirect("/roles");
    }

    res.render("roles/role-users", {
      title: "Utilisateurs du role",
      role,
      users: role.users || [],
      error: null
    });
  } catch (error) {
    res.status(500).render("roles/role-users", {
      title: "Utilisateurs du role",
      role: null,
      users: [],
      error: error.message
    });
  }
});

export default roleWebRoute;
