import { Databases, ID, Query } from "node-appwrite";
import { database } from "../appwrite.config";
import { parseStringify } from "../utils";

export async function createAppointment(appointment) {
  const res = await database.createDocument(
    process.env.DATABASE_ID,
    process.env.APPOINTMENT_COLLECTION_ID,
    ID.unique(),
    appointment
  );
  return parseStringify(res);
}

export async function getAppointment() {
  const result = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.APPOINTMENT_COLLECTION_ID,
    [Query.orderDesc("$createdAt")]
  );
  return parseStringify(result);
}

export async function getAppointmentById(appointmentId) {
  const result = await database.getDocument(
    process.env.DATABASE_ID,
    process.env.APPOINTMENT_COLLECTION_ID,
    appointmentId
  );
  return parseStringify(result);
}
