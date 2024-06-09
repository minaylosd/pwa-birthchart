import { openDB } from "idb";

const dbName = 'chartMasterPWA';
const storeName = 'persons';

async function initDB() {
    return openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true})
            }
        }
    })
}

async function addPerson(person) {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(person);
    await tx.done
}

async function deletePerson(id) {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(person);
    await tx.done
}

async function editPerson(id, updatedPerson) {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const person = await store.get(id);
    Object.assign(person, updatedPerson);
    await store.put(person);
    await tx.done
}

async function getAllPersons() {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const persons = await store.getAll();
    await tx.done
    return persons;
}

export {initDB, addPerson, deletePerson, editPerson, getAllPersons};