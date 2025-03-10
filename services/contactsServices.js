import { Op } from "sequelize";

import Contact from "../db/models/Contact.js";

export const listContacts = (owner) => Contact.findAll({
    where: { owner }
});

export const getContactById = (contactId, owner) => Contact.findOne({
    where: {
        [Op.and]: [{ id: contactId }, { owner: owner }],
    }
});

export const removeContact = async (contactId, owner) => {
    const contact = await getContactById(contactId, owner);
    if (!contact) {
        return null;
    }
    await contact.destroy();
    return contact;
}

export const addContact = (data, owner) => Contact.create({ ...data, owner});

export const updateContact = async (contactId, data, owner)=> {
    const contact = await getContactById(contactId, owner);
    if (!contact) {
        return null;
    }

    return contact.update(data, {
        returning: true,
    });
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};