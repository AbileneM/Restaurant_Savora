import { body, query, param, check } from "express-validator";

const userValidator = [
    body('nom').notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit comporter au moins 2 caractères')
        .isAlpha().withMessage('Le nom doit contenir uniquement des lettres'),
    body('email').isEmail().withMessage('L\'email doit être valide'),
    body('password').isLength({ min: 7 }).withMessage('Le mot de passe doit comporter au moins 7 caractères')
        .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
        .matches(/[@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),   
   param('roleId').optional().isInt().withMessage('L\'ID doit être un entier')
];

export default userValidator;