import { Router } from "express";
import { Category, Client, Menu, Reservation, Review, Table, User, Role } from "../models/Relation.js";
import { normalizeRole } from "../auth/autorisation.js";

const adminWebRoute = Router();

const resourceAccess = {
  admin: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  administrateur: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  coordinateur: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  coordonnateur: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  coordonateur: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  cordina: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  cordin: ["categories", "menu", "clients", "tables", "reservations", "reviews"],
  employe: ["reservations", "reviews"],
  employee: ["reservations", "reviews"]
};

const resources = {
  categories: {
    title: "Categories",
    model: Category,
    pk: "id_categorie",
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" }
    ],
    columns: [
      { key: "nom", label: "Nom" },
      { key: "description", label: "Description" }
    ]
  },
  menu: {
    title: "Menu",
    model: Menu,
    pk: "id_menu",
    refs: {
      categories: async () => Category.findAll({ order: [["nom", "ASC"]] })
    },
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "prix", label: "Prix", type: "number", step: "0.01", required: true },
      { name: "image_plat", label: "Image du plat", type: "text" },
      { name: "id_categorie", label: "Categorie", type: "select", options: "categories", optionValue: "id_categorie", optionLabel: "nom" }
    ],
    columns: [
      { key: "nom", label: "Nom" },
      { key: "prix", label: "Prix" },
      { key: "id_categorie", label: "Categorie", ref: "categories", optionValue: "id_categorie", optionLabel: "nom" }
    ]
  },
  clients: {
    title: "Clients",
    model: Client,
    pk: "id_client",
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      { name: "prenom", label: "Prenom", type: "text", required: true },
      { name: "telephone", label: "Telephone", type: "text" },
      { name: "email", label: "Email", type: "email" }
    ],
    columns: [
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prenom" },
      { key: "telephone", label: "Telephone" },
      { key: "email", label: "Email" }
    ]
  },
  tables: {
    title: "Tables",
    model: Table,
    pk: "id_table",
    fields: [
      { name: "numero_table", label: "Numero de table", type: "number", required: true },
      { name: "capacite", label: "Capacite", type: "number", required: true },
      { name: "disponibilite", label: "Disponible", type: "checkbox" }
    ],
    columns: [
      { key: "numero_table", label: "Numero" },
      { key: "capacite", label: "Capacite" },
      { key: "disponibilite", label: "Disponible", boolean: true }
    ]
  },
  reservations: {
    title: "Reservations",
    model: Reservation,
    pk: "id_reservation",
    refs: {
      clients: async () => Client.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] }),
      tables: async () => Table.findAll({ order: [["numero_table", "ASC"], ["id_table", "ASC"]] })
    },
    fields: [
      { name: "date_reservation", label: "Date", type: "date", required: true },
      { name: "heure_reservation", label: "Heure", type: "time", required: true },
      { name: "nombre_personnes", label: "Nombre de personnes", type: "number", required: true },
      { name: "id_client", label: "Client", type: "select", options: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` },
      { name: "id_table", label: "Table", type: "select", options: "tables", optionValue: "id_table", optionLabel: item => `Table ${item.numero_table || item.id_table} (${item.capacite} places)` }
    ],
    columns: [
      { key: "date_reservation", label: "Date" },
      { key: "heure_reservation", label: "Heure" },
      { key: "nombre_personnes", label: "Personnes" },
      { key: "id_client", label: "Client", ref: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` },
      { key: "id_table", label: "Table", ref: "tables", optionValue: "id_table", optionLabel: item => `Table ${item.numero_table || item.id_table}` }
    ]
  },
  reviews: {
    title: "Reviews",
    model: Review,
    pk: "id_review",
    refs: {
      clients: async () => Client.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] })
    },
    fields: [
      { name: "note", label: "Note", type: "number", required: true },
      { name: "commentaire", label: "Commentaire", type: "textarea" },
      { name: "id_client", label: "Client", type: "select", options: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` }
    ],
    columns: [
      { key: "note", label: "Note" },
      { key: "commentaire", label: "Commentaire" },
      { key: "id_client", label: "Client", ref: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` }
    ]
  }
};

const getResource = name => resources[name];

const getAllowedResources = roleName => resourceAccess[normalizeRole(roleName)] || [];

const redirectWithSuccess = (res, resourceName, message) => {
  res.redirect(`/admin/${resourceName}?success=${encodeURIComponent(message)}`);
};

adminWebRoute.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { include: Role });
    if (!user) return res.redirect("/login");

    req.currentAdminUser = user;
    req.currentAdminRole = normalizeRole(user.role?.name);
    res.locals.adminRole = req.currentAdminRole;
    res.locals.allowedAdminResources = getAllowedResources(user.role?.name);

    next();
  } catch (error) {
    res.status(403).render("unauthorized", {
      title: "Acces refuse",
      message: error.message
    });
  }
});

const requireResourceAccess = (req, res, next) => {
  const resourceName = req.params.resource;
  const allowedResources = getAllowedResources(req.currentAdminRole);

  if (allowedResources.includes(resourceName)) return next();

  return res.status(403).render("unauthorized", {
    title: "Acces refuse",
    message: "Votre role ne permet pas d'acceder a cette section."
  });
};

const loadRefs = async resource => {
  const refs = {};

  for (const [name, loader] of Object.entries(resource.refs || {})) {
    refs[name] = await loader();
  }

  return refs;
};

const optionLabel = (field, item) => {
  if (!item) return "";
  if (typeof field.optionLabel === "function") return field.optionLabel(item);
  return item[field.optionLabel];
};

const displayValue = (column, row, refs) => {
  const value = row[column.key];

  if (column.boolean) return value ? "Oui" : "Non";

  if (column.ref) {
    const item = refs[column.ref]?.find(refItem => Number(refItem[column.optionValue]) === Number(value));
    return item ? optionLabel(column, item) : "Non defini";
  }

  return value ?? "";
};

const formData = (resource, body) => {
  const data = {};

  resource.fields.forEach(field => {
    if (field.type === "checkbox") {
      data[field.name] = body[field.name] === "on";
      return;
    }

    if (body[field.name] !== undefined && body[field.name] !== "") {
      data[field.name] = body[field.name];
    } else if (!field.required) {
      data[field.name] = null;
    }
  });

  return data;
};

adminWebRoute.get("/", (req, res) => {
  const allowedResources = getAllowedResources(req.currentAdminRole);
  const visibleResources = Object.fromEntries(
    Object.entries(resources).filter(([name]) => allowedResources.includes(name))
  );

  res.render("admin/dashboard", {
    title: "Administration",
    resources: visibleResources
  });
});

adminWebRoute.get("/:resource", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    const [rows, refs] = await Promise.all([
      resource.model.findAll({ order: [[resource.pk, "ASC"]] }),
      loadRefs(resource)
    ]);

    res.render("admin/list", {
      resourceName: req.params.resource,
      resource,
      rows,
      refs,
      displayValue,
      error: null,
      success: req.query.success || null
    });
  } catch (error) {
    res.status(500).render("admin/list", {
      resourceName: req.params.resource,
      resource,
      rows: [],
      refs: {},
      displayValue,
      error: error.message,
      success: null
    });
  }
});

adminWebRoute.get("/:resource/add", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  res.render("admin/form", {
    mode: "add",
    resourceName: req.params.resource,
    resource,
    refs: await loadRefs(resource),
    record: {},
    optionLabel,
    error: null
  });
});

adminWebRoute.post("/:resource", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    await resource.model.create(formData(resource, req.body));
    redirectWithSuccess(res, req.params.resource, "Ajout effectue avec succes.");
  } catch (error) {
    res.status(400).render("admin/form", {
      mode: "add",
      resourceName: req.params.resource,
      resource,
      refs: await loadRefs(resource),
      record: req.body,
      optionLabel,
      error: error.message
    });
  }
});

adminWebRoute.get("/:resource/edit/:id", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  const record = await resource.model.findByPk(req.params.id);
  if (!record) return res.status(404).redirect(`/admin/${req.params.resource}`);

  res.render("admin/form", {
    mode: "edit",
    resourceName: req.params.resource,
    resource,
    refs: await loadRefs(resource),
    record,
    optionLabel,
    error: null
  });
});

adminWebRoute.put("/:resource/:id", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    const record = await resource.model.findByPk(req.params.id);
    if (!record) return res.status(404).redirect(`/admin/${req.params.resource}`);

    await record.update(formData(resource, req.body));
    redirectWithSuccess(res, req.params.resource, "Modification effectuee avec succes.");
  } catch (error) {
    res.status(400).render("admin/form", {
      mode: "edit",
      resourceName: req.params.resource,
      resource,
      refs: await loadRefs(resource),
      record: { [resource.pk]: req.params.id, ...req.body },
      optionLabel,
      error: error.message
    });
  }
});

adminWebRoute.delete("/:resource/:id", requireResourceAccess, async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    const record = await resource.model.findByPk(req.params.id);
    if (record) await record.destroy();
    redirectWithSuccess(res, req.params.resource, "Suppression effectuee avec succes.");
  } catch (error) {
    const rows = await resource.model.findAll({ order: [[resource.pk, "ASC"]] });
    const refs = await loadRefs(resource);

    res.status(400).render("admin/list", {
      resourceName: req.params.resource,
      resource,
      rows,
      refs,
      displayValue,
      error: error.message,
      success: null
    });
  }
});

export default adminWebRoute;
