import { body, query, param, check } from "express-validator";
const userValidator = [
    body('nom').notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 5 }).withMessage('Le nom doit comporter au moins 5 caractères')
        .isAlpha().withMessage('Le nom doit contenir uniquement des lettres'),
    body('prenom').notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 5 }).withMessage('Le prénom doit comporter au moins 5 caractères')
        .isAlpha().withMessage('Le prénom doit contenir uniquement des lettres'),
    body('email').isEmail().withMessage('L\'email doit être valide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit comporter au moins 8 caractères')
        .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
        .matches(/[@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),   
    body('naissance').isDate().withMessage('La date de naissance doit être une date valide')
        .custom((value) => {
            const today = new Date();   
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();  
            if (age < 0 || age > 150) {
                throw new Error('L\'âge doit être compris entre 0 et 150 ans');
            }
            return true;
        }),
    body('biographie').optional().isLength({ max: 500 }).withMessage('La biographie ne doit pas dépasser 500 caractères'),
    body('photo').optional().isURL().withMessage('La photo doit être une URL valide'),
    body('assiduite').optional().isBoolean().withMessage('L\'assiduité doit être un booléen'),
    body('departmentId').optional().isInt().withMessage('Le departmentId doit être un entier'),
    param('id').optional().isInt().withMessage('L\'ID doit être un entier')
];

export default userValidator;