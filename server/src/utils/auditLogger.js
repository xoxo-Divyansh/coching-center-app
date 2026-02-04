import AuditLog from "../models/AuditLog.js";

const auditLogger = async ({
  adminId,
  action,
  entity,
  entityId = null,
  req,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      entity,
      entityId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

export default auditLogger;
