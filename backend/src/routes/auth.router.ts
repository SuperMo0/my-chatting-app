import { Router } from "express";
import * as controller from '../controllers/auth.controller.js'
import protect from '../middlewares/protect.js'




const router = Router();


router.post('/login', controller.login);


router.post('/signup', controller.signup);

router.post('/logout', controller.logout);

router.get('/check', protect, controller.check);


export default router



