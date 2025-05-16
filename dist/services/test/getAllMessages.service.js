import TestClient from "#db/models/TestClient.js";
import ApiError from "#utils/api/ApiError.js";
export default async function getAllMessages(clinic_id) {
    if (!clinic_id) {
        throw new ApiError(400, "clinic_id is required");
    }
    const testUser = await TestClient.findOne({
        clinic_id,
    });
    if (!testUser) {
        return [];
    }
    const messages = testUser.messages;
    return messages;
}
