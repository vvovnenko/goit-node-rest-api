import { readFile, writeFile } from "fs/promises"
import { resolve } from "path"
import { nanoid } from "nanoid";

const contactsPath = resolve( "db", "contacts.json");

const updateContacts = contacts => writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
    const data = await readFile(contactsPath, "utf-8");
    return JSON.parse(data);
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);
    return result || null;
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if(index === -1) return null;
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
}

export async function addContact(data) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

async function updateContact(contactId, { ...data }) {
    const contacts = await listContacts();
    const idx = contacts.findIndex(({ id }) => id === contactId);
    if (idx === -1) {
        return null;
    }
    const updatedContact = { ...contacts[idx] };
    for (const key in data) {
        if (data[key] !== undefined) {
            updatedContact[key] = data[key];
        }
    }
    contacts[idx] = { ...contacts[idx], ...updatedContact };
    await updateContacts(contacts);
    return updatedContact;
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};