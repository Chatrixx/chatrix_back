export default async function auth(req, res, next) {
  try {
    // TODO: Implement Logic
    req.user = {
      _id: "67b95627085cebf763d2a806",
      role: "admin",
      name: "yasinakgul_bakirkoy",
      openai_assistant: {
        assistant_id: "asst_GY55jnlwDLWxKJUJJcS3musx",
      },
    };
    next();
  } catch {
    res.status(401).send({ error: "Unauthorized" });
  }
}
