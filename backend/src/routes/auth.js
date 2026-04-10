import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
export default Router().post('/register', register).post('/login', login);