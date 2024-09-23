import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { database, messaging } from "../appwrite.config";

export async function createDoctor(doctor) {
  try {
    const res = await database.createDocument(
      process.env.DATABASE_ID,
      process.env.DOCTOR_COLLECTION_ID,
      ID.unique(),
      doctor
    );
    return parseStringify(res);
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
}

export async function getDoctor() {
  const result = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.DOCTOR_COLLECTION_ID,
    [Query.orderDesc("$createdAt")]
  );
  return parseStringify(result);
}

export async function updateDoctor(updatedData) {
  try {
    const result = await database.updateDocument(
      process.env.DATABASE_ID,
      process.env.DOCTOR_COLLECTION_ID,
      updatedData[1],
      updatedData[0],
      ['read("any")']
    );
    return result;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function sendSMSNotification(messageData) {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      messageData.content,
      [],
      [messageData.userId]
    );
  } catch (error) {
    console.log(error);
  }
}
