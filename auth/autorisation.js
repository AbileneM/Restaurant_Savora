import { User, Role } from '../models/Relation.js'

const normalizeRole = role => (role || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

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
        const userRoleTitles = userRoles.map(role => normalizeRole(role.name))

        if (!userRoles.length) return res.status(403).json({ message: "Vous n'avez pas la permission!" })

        roles?.forEach(role => {
            if (userRoleTitles.includes(normalizeRole(role)))
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

export const autoriserWeb = roles => async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, { include: Role })
        if (!user) return res.redirect('/login')

        const userRole = normalizeRole(user.role?.name)
        const allowedRoles = roles.map(normalizeRole)

        if (allowedRoles.includes(userRole)) {
            req.currentUser = user
            req.currentRole = userRole
            return next()
        }

        return res.status(403).render('unauthorized', {
            title: 'Acces refuse',
            message: "Vous n'avez pas la permission d'acceder a cette page."
        })
    } catch (error) {
        return res.status(403).render('unauthorized', {
            title: 'Acces refuse',
            message: error.message
        })
    }
}

export { normalizeRole }
export default autoriser
