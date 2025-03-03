import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getAllContacts));

contactsRouter.get('/:id(\\d+)', ctrlWrapper(getOneContact));

contactsRouter.delete('/:id(\\d+)', ctrlWrapper(deleteContact));

contactsRouter.post(
    '/',
    validateBody(createContactSchema),
    ctrlWrapper(createContact)
);

contactsRouter.put(
    '/:id(\\d+)',
    validateBody(updateContactSchema),
    ctrlWrapper(updateContact)
);

contactsRouter.patch(
    '/:id(\\d+)/favorite',
    validateBody(updateContactFavoriteSchema),
    ctrlWrapper(updateContact)
);

export default contactsRouter;