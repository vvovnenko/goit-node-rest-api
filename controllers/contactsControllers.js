import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
    const { id: owner } = req.user;
    const contacts = await contactsService.listContacts(owner);
    res.json(contacts);
};

export const getOneContact = async (req, res) => {
    const { id: owner } = req.user;
    const contact = await contactsService.getContactById(req.params.id, owner);
    if (contact) {
        res.json(contact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};

export const deleteContact = async (req, res) => {
    const { id: owner } = req.user;
    const del_contact = await contactsService.removeContact(req.params.id, owner);
    if (del_contact) {
        res.json(del_contact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};

export const createContact = async (req, res) => {
    const { id: owner } = req.user;
    const newContact = await contactsService.addContact(req.body, owner);
    res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
    const { id: owner } = req.user;
    if (Object.keys(req.body).length === 0) {
        throw HttpError(400, 'Body must have at least one field');
    }
    const updatedContact = await contactsService.updateContact(
        req.params.id,
        req.body,
        owner,
    );
    if (updatedContact) {
        res.json(updatedContact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};
