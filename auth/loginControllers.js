import { User } from "../models/Relation.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";

export const loginForm = (req, res) => {
    const token = req.cookies.token  // Check if token is in cookies 
    
    //Verification de la presence du token
    if (token) return res.redirect('/users') // Redirect to login if token is not present
    
    res.render('./users/login') // Rendu de la vue login.ejs
}

export const logout = (req, res) => {
    const token = req.cookies.token  // Check if token is in cookies 
    
    //Verification de la presence du token
    if (token) return res.clearCookie('token').redirect('/login') // Redirect to login if token verification fails
    
    res.render('./users/login') // Rendu de la vue login.ejs
}

export const login = async (req, res) => {
    
    //Recuperation des resultats de la validation 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    //Les informations de connexion

    const { email, password } = req.body

    //Vérification de l'email
    if (!email) return res.status(404).json({ message: "L'email est incorrect" })

    //Chercher la personne dans la base de données

    try {
        const user = await User.findOne({ where: { email }})

        //Verifier la presence de cette personne dans la base de donnees
        if (!user) return res.status(404).json({ message: "La personne n'existe pas!" })
        //Verification du mot de passe

        const mdpCorrect = bcrypt.compareSync(password, user.password)

        if (!mdpCorrect) return res.status(401).json({ message: "Mot de passe incorrect" })

        //Creation de la clef d'acces
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.CODE_SECRET)

        // res.status(200).json({ data: user, token })
        res.cookie('token', token,{ httpOnly: true}).cookie('user',JSON.stringify(user), { httpOnly: true}) // Set cookie with token
        res.redirect('/users') // Redirect to users page after successful login 

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}