import { User, Role } from '../models/Relation.js'

const autoriser = roles => async (req, res, next) => {

    //Recuperer l'ID a partir de la req
    const id = req.userId

    //Chercher la personne dans la base de données

    try {
        const user = await User.findByPk(id, { include: Role })
        if (!user) return res.status(404).json({ message: "Cet utilisateur n'existe pas!" })

        //Récuperer le rôle de la personne 
        const userRoles = user.role ? [user.role] : []

        let hasRole = false
        const userRoleTitles = userRoles.map(role => role.name.toLowerCase())

        if (!userRoles.length) return res.status(403).json({ message: "Vous n'avez pas la permission!" })

        roles?.forEach(role => {
            if (userRoleTitles.includes(role.toLowerCase()))
                hasRole = true
        });

        if (hasRole) {
            next()
            return
        } else {
            return res.status(403).json({ message: "Vous n'etes pas autorises..." })
        }


    } catch (error) {
        res.status(403).json({ message: error.message })
    }

}

export default autoriser
