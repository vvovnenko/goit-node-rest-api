import Contact from "../db/models/Contact.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (contactId) => Contact.findByPk(contactId);

export const removeContact = async (contactId) => {
    const contact = await getContactById(contactId);
    if (!contact) {
        return null;
    }
    await contact.destroy();
    return contact;
}

export const addContact = (data) => Contact.create(data);

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