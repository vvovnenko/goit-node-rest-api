import {Router} from "express";


import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import { authRegisterSchema, authLoginSchema } from "../schemas/authSchemas.js";

import { register, login, getCurrent, logout, updateAvatar } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(register));

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(login));

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

authRouter.get("/current", authenticate, ctrlWrapper(getCurrent));

authRouter.patch("/avatars", authenticate, upload.single("avatar"), ctrlWrapper(updateAvatar));


export default authRouter;