import jwt from 'jsonwebtoken'

export const verifierToken = (req, res, next) => {
    //Récuperation du token
    
    const token = req.cookies.token  // Check if token is in cookies 

    //Vérification de la présence du token
    if (!token) return res.redirect('/login') // Redirect to login if token is not present

    jwt.verify(token, process.env.CODE_SECRET || 'savora-dev-jwt-secret', (err, payload) => {
        if (err) return res.clearCookie('token').redirect('/login') // Redirect to login if token verification fails

        req.userId = payload.id

        next()
    })

}

