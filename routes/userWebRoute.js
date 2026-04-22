import { Router } from "express";
import bcrypt from "bcryptjs";
import { Role, User } from "../models/Relation.js";

const userWebRoute = Router();

const loadRoles = () => Role.findAll({ order: [["id_role", "ASC"]] });

userWebRoute.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role,
      order: [["id_user", "ASC"]]
    });

    res.render("users/user-list-web", {
      title: "Gestion des utilisateurs",
      users,
      error: null
    });
  } catch (error) {
    res.status(500).render("users/user-list-web", {
      title: "Gestion des utilisateurs",
      users: [],
      error: error.message
    });
  }
});

userWebRoute.get("/add", async (req, res) => {
  const roles = await loadRoles();

  res.render("users/add-user-web", {
    title: "Ajouter un utilisateur",
    user: {},
    roles,
    error: null
  });
});

userWebRoute.post("/", async (req, res) => {
  const { nom, email, password, roleId } = req.body;
  const roles = await loadRoles();

  if (!nom?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).render("users/add-user-web", {
      title: "Ajouter un utilisateur",
      user: req.body,
      roles,
      error: "Le nom, l'email et le mot de passe sont obligatoires."
    });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      nom: nom.trim(),
      email: email.trim(),
      password: hashedPassword,
      roleId: roleId || null
    });

    res.redirect("/users");
  } catch (error) {
    res.status(400).render("users/add-user-web", {
      title: "Ajouter un utilisateur",
      user: req.body,
      roles,
      error: error.message
    });
  }
});

userWebRoute.get("/edit/:id", async (req, res) => {
  try {
    const [user, roles] = await Promise.all([
      User.findByPk(req.params.id),
      loadRoles()
    ]);

    if (!user) {
      return res.status(404).redirect("/users");
    }

    res.render("users/edit-user-web", {
      title: "Modifier un utilisateur",
      user,
      roles,
      error: null
    });
  } catch (error) {
    res.status(500).redirect("/users");
  }
});

userWebRoute.put("/:id", async (req, res) => {
  const { nom, email, password, roleId } = req.body;
  const roles = await loadRoles();

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).redirect("/users");
    }

    if (!nom?.trim() || !email?.trim()) {
      return res.status(400).render("users/edit-user-web", {
        title: "Modifier un utilisateur",
        user: { ...user.toJSON(), ...req.body },
        roles,
        error: "Le nom et l'email sont obligatoires."
      });
    }

    const updateData = {
      nom: nom.trim(),
      email: email.trim(),
      roleId: roleId || null
    };

    if (password?.trim()) {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    await user.update(updateData);
    res.redirect("/users");
  } catch (error) {
    const user = await User.findByPk(req.params.id);

    res.status(400).render("users/edit-user-web", {
      title: "Modifier un utilisateur",
      user: user ? { ...user.toJSON(), ...req.body } : req.body,
      roles,
      error: error.message
    });
  }
});

userWebRoute.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      await user.destroy();
    }

    res.redirect("/users");
  } catch (error) {
    const users = await User.findAll({
      include: Role,
      order: [["id_user", "ASC"]]
    });

    res.status(400).render("users/user-list-web", {
      title: "Gestion des utilisateurs",
      users,
      error: error.message
    });
  }
});

export default userWebRoute;
