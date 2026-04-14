import { body } from "express-validator"


const loginRules = [
    body('email').exists().withMessage('email obligatoire').isEmail().withMessage("ceci n'est pas un email"),
    body('password').isString()
        .isLength({ min: 7 }).withMessage('au moins 7 caracteres')
        .matches(/\d/).withMessage('au moins un chiffre')
        .matches(/[a-z]/).withMessage('au moins une lettre minuscule')
        .matches(/[A-Z]/).withMessage('au moins une lettre majuscule')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('au moins un caractere special')
]

export default loginRules