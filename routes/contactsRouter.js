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
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getAllContacts));

contactsRouter.get('/:id', ctrlWrapper(getOneContact));

contactsRouter.delete('/:id', ctrlWrapper(deleteContact));

contactsRouter.post(
    '/',
    validateBody(createContactSchema),
    ctrlWrapper(createContact)
);

contactsRouter.put(
    '/:id',
    validateBody(updateContactSchema),
    ctrlWrapper(updateContact)
);

export default contactsRouter;