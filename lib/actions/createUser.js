import { ID } from "node-appwrite";
import { database, users } from "../appwrite.config";
import { parseStringify } from "../utils";

export async function createPatient(patient) {
  const res = await database.createDocument(
    process.env.DATABASE_ID,
    process.env.PATIENT_COLLECTION_ID,
    ID.unique(),
    patient
  );
  return parseStringify(res);
}

export const createUser = async (user) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phoneNumber,
      undefined,
      user.fullName
    );
    return parseStringify(newuser);
  } catch (error) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export async function getUsers() {
  const result = await users.list([], "<SEARCH>");
  return parseStringify(result);
}

export async function getPatinets() {
  const result = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.PATIENT_COLLECTION_ID
  );
  return parseStringify(result);
}

export async function getPatientById(patientId) {
  const result = await database.getDocument(
    process.env.DATABASE_ID,
    process.env.PATIENT_COLLECTION_ID,
    patientId
  );
  return parseStringify(result);
}
