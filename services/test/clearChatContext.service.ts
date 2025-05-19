import TestClient from "#db/models/TestClient.js";
import ApiError from "#utils/api/ApiError.js";

export default async function clearChatContext(clinic_id: string) {
  if (!clinic_id) {
    throw new ApiError(400, "clinic_id is required");
  }

  const testUser = await TestClient.findOne({
    clinic_id,
  });

  if (!testUser) throw new ApiError(400, "No test user.");

  testUser.messages = [];
  testUser.thread_id = null;

  await testUser.save();

  return { message: "Chat context is cleared" };
}
