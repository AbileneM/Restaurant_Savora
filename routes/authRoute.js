import { Router } from "express";
import { login, loginForm, logout } from "../auth/loginControllers.js";
import loginRules from "../validations/loginValidation.js";

const authRoute = Router()

authRoute.post('/', loginRules, login)
    .get('/', loginForm)
    .get('/logout', logout)

export default authRoute