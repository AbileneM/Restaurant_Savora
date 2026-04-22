import { User } from "../models/Relation.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";

export const loginForm = (req, res) => {
    const token = req.cookies.token  // Check if token is in cookies 
    
    //Verification de la presence du token
    if (token) return res.redirect('/users') // Redirect to login if token is not present
    
    res.render('login', { title: 'Connexion', error: null, email: '' })
}

export const logout = (req, res) => {
    res.clearCookie('token')
        .clearCookie('user')
        .redirect('/login')
}

export const login = async (req, res) => {
    
    //Recuperation des resultats de la validation 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).render('login', {
            title: 'Connexion',
            error: errors.array()[0].msg,
            email: req.body.email || ''
        });
    }
    
    //Les informations de connexion

    const { email, password } = req.body

    //Vérification de l'email
    if (!email) return res.status(404).render('login', {
        title: 'Connexion',
        error: "L'email est incorrect",
        email: ''
    })

    //Chercher la personne dans la base de données

    try {
        const user = await User.findOne({ where: { email }})

        //Verifier la presence de cette personne dans la base de donnees
        if (!user) return res.status(404).render('login', {
            title: 'Connexion',
            error: "La personne n'existe pas!",
            email
        })
        //Verification du mot de passe

        const mdpCorrect = bcrypt.compareSync(password, user.password)

        if (!mdpCorrect) return res.status(401).render('login', {
            title: 'Connexion',
            error: "Mot de passe incorrect",
            email
        })

        //Creation de la clef d'acces
        const payload = { id: user.id_user }
        const token = jwt.sign(payload, process.env.CODE_SECRET || 'savora-dev-jwt-secret')

        // res.status(200).json({ data: user, token })
        const safeUser = {
            id_user: user.id_user,
            nom: user.nom,
            email: user.email,
            roleId: user.roleId
        }
        res.cookie('token', token, { httpOnly: true }).cookie('user', JSON.stringify(safeUser), { httpOnly: true })
        res.redirect('/users') // Redirect to users page after successful login 

    } catch (error) {
        res.status(400).render('login', {
            title: 'Connexion',
            error: error.message,
            email: email || ''
        })
    }
}
