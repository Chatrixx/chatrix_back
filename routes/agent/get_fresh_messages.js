import express from "express";
import dotenv from "dotenv";
import dbConnect from "../../db/mongodb.js";
import clinic from "../../db/models/clinic.js";
import { getChannelIndicator } from "../../util/channel.js";
import user from "../../db/models/user.js";

const router = express.Router();
dotenv.config();

router.post("/", async (req, res) => {
  try {
    await dbConnect();
  } catch (err) {
    return res.status(500).json({ error: "Error connecting to database" });
  }
  const indicator = getChannelIndicator(req.body.channel) ?? null;
  try {
    if (!req.body.clinic_id)
      return res.status(400).json({ error: "clinic_id is required" });

    if (!req.body.channel)
      return res.status(400).json({ error: "channel is required" });

    if (!indicator) return res.status(400).json({ error: "Invalid channel" });
    if (!req.body.contact_data?.[indicator])
      return res.status(400).json({ error: `${indicator} is required` });
  } catch (err) {
    const error = err.message ?? err;
    return res.status(400).json({ error });
  }

  //   user?.channels[req.body.channel]['profile_info'][indicator] = req.body[indicator];

  const customer = await user.findOne({
    clinic_id: req.body.clinic_id,
    [`channels.${req.body.channel}.profile_info.${indicator}`]:
      req.body.contact_data?.[indicator],
  });

  if (!customer) return res.status(404).json({ error: "Customer not found" });
  const messages = customer.channels[req.body.channel].messages;
  const fresh_messages = messages.filter(
    (message) => message.fresh && message.role === "agent"
  );
  if (fresh_messages.length === 0)
    return res.status(404).json({ error: "No fresh messages" });

  await user.updateOne(
    {
      clinic_id: req.body.clinic_id,
      [`channels.${req.body.channel}.profile_info.${indicator}`]:
        req.body.contact_data?.[indicator],
    },
    {
      $set: {
        [`channels.${req.body.channel}.messages.$[elem].fresh`]: false,
      },
    },
    {
      arrayFilters: [
        {
          "elem.fresh": true,
        },
      ],
    }
  );
  return res.status(200).json({
    version: "v2",
    content: {
      type: req.body.channel,
      messages: [
        fresh_messages.map((message) => ({
          type: message.type,
          text: message.content,
        })),
      ],
      actions: [],
      quick_replies: [],
    },
  });
});

export default router;
