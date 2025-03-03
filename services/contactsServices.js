import User from "../db/models/User.js";

export const listContacts = () => User.findAll();

export const getContactById = (contactId) => User.findByPk(contactId);

export const removeContact = async (contactId) => {
    const contact = await getContactById(contactId);
    if (!contact) {
        return null;
    }
    await contact.destroy();
    return contact;
}

export const addContact = (data) => User.create(data);

export const updateContact = async (contactId, data)=> {
    const contact = await getContactById(contactId);
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