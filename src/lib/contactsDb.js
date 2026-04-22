import Dexie from "dexie";

export const db = new Dexie("ContactsApp");

db.version(1).stores({
  contacts: "++id,name,key,subKey,data",
});
