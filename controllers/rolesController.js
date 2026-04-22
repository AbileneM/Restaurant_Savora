import { Role, User } from "../models/Relation.js";

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un rôle par son id
export const getRoleById = async (req, res) => {
   const { id } = req.params
    try {
        const role = await Role.findByPk(id, {
            include: {
                model: User,
                through: {
                    attributes: []
                }
            }
        })
        if (!role) return res.status(404).json({ message: "Role non trouve" })

        res.status(200).json({ data: role })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// Ajouter un nouveau rôle
export const createRole = async (req, res) => {
  const role = req.body
    try {
        const result = await Role.create(role)
        res.status(201).json({ message: "Rôle ajouté", data: result })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

// Modifier un rôle par son id
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    await role.update({
      name: req.body.name
    });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un rôle par son id
export const deleteRole = async (req, res) => {
    const { id } = req.params
    try {
        const result = await Role.destroy({ where: { id_role: id } })
        if (!result) return res.status(404).json({ message: "Role non trouve" })

        res.status(200).json({ message: `Role ${id} supprime`, data: result })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

}

// Controllers lies aux relations

export const roleUsers = async (req, res) => {
    const { id } = req.params
    try {
        const role = await Role.findByPk(id)
        if (!role) return res.status(404).json({ message: "Role non trouve" })

        const users = await role.getUsers({
            attributes:{
                exclude:["password"]
            },
        })
        res.status(200).json({ data: users })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
