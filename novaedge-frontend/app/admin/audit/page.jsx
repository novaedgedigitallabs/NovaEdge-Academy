// app/admin/audit/page.jsx
"use client";

import { motion } from "framer-motion";
import AuditLogList from "@/components/admin/audit/AuditLogList";

const premiumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={premiumSpring}
      >
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Audit Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          System activity and administrative actions
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...premiumSpring }}
      >
        <AuditLogList />
      </motion.div>
    </div>
  );
}
