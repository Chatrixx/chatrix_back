import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invoice_number: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "₺",
  },
  due_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid", "overdue"],
    default: "unpaid",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Auto-generate invoice number before saving
InvoiceSchema.pre("save", async function (next) {
  if (!this.invoice_number) {
    const today = new Date();
    const countToday = await mongoose.models.Invoice.countDocuments({
      created_at: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.invoice_number = `INV-${datePart}-${countToday + 1}`;
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
