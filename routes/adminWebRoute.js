import { Router } from "express";
import { Category, Client, Menu, Reservation, Review, Table } from "../models/Relation.js";

const adminWebRoute = Router();

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
      { name: "capacite", label: "Capacite", type: "number", required: true },
      { name: "disponibilite", label: "Disponible", type: "checkbox" }
    ],
    columns: [
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
      tables: async () => Table.findAll({ order: [["id_table", "ASC"]] })
    },
    fields: [
      { name: "date_reservation", label: "Date", type: "date", required: true },
      { name: "heure_reservation", label: "Heure", type: "time", required: true },
      { name: "nombre_personnes", label: "Nombre de personnes", type: "number", required: true },
      { name: "id_client", label: "Client", type: "select", options: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` },
      { name: "id_table", label: "Table", type: "select", options: "tables", optionValue: "id_table", optionLabel: item => `Table ${item.id_table} (${item.capacite} places)` }
    ],
    columns: [
      { key: "date_reservation", label: "Date" },
      { key: "heure_reservation", label: "Heure" },
      { key: "nombre_personnes", label: "Personnes" },
      { key: "id_client", label: "Client", ref: "clients", optionValue: "id_client", optionLabel: item => `${item.nom} ${item.prenom}` },
      { key: "id_table", label: "Table", ref: "tables", optionValue: "id_table", optionLabel: item => `Table ${item.id_table}` }
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
  res.render("admin/dashboard", {
    title: "Administration",
    resources
  });
});

adminWebRoute.get("/:resource", async (req, res) => {
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
      error: null
    });
  } catch (error) {
    res.status(500).render("admin/list", {
      resourceName: req.params.resource,
      resource,
      rows: [],
      refs: {},
      displayValue,
      error: error.message
    });
  }
});

adminWebRoute.get("/:resource/add", async (req, res) => {
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

adminWebRoute.post("/:resource", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    await resource.model.create(formData(resource, req.body));
    res.redirect(`/admin/${req.params.resource}`);
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

adminWebRoute.get("/:resource/edit/:id", async (req, res) => {
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

adminWebRoute.put("/:resource/:id", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    const record = await resource.model.findByPk(req.params.id);
    if (!record) return res.status(404).redirect(`/admin/${req.params.resource}`);

    await record.update(formData(resource, req.body));
    res.redirect(`/admin/${req.params.resource}`);
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

adminWebRoute.delete("/:resource/:id", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).redirect("/admin");

  try {
    const record = await resource.model.findByPk(req.params.id);
    if (record) await record.destroy();
    res.redirect(`/admin/${req.params.resource}`);
  } catch (error) {
    const rows = await resource.model.findAll({ order: [[resource.pk, "ASC"]] });
    const refs = await loadRefs(resource);

    res.status(400).render("admin/list", {
      resourceName: req.params.resource,
      resource,
      rows,
      refs,
      displayValue,
      error: error.message
    });
  }
});

export default adminWebRoute;
