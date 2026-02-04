import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "BLOCK_USER",
      ],
    },

    entity: {
      type: String, // e.g. Course, Enrollment, User
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    ipAddress: String,
    userAgent: String,

    metadata: {
      type: Object, // extra info (price change, status, etc.)
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
