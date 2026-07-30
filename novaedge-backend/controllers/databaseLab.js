const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * 1. ACID & Transactions Simulation Endpoint
 */
exports.runAcidDemo = async (req, res) => {
  try {
    const { amount = 100, shouldFail = false, isolationLevel = "Read Committed" } = req.body;

    const steps = [
      { step: 1, action: "START TRANSACTION", detail: `Started session with isolation level: ${isolationLevel}` },
      { step: 2, action: "READ ACCOUNTS", detail: "Loaded Sender Account ($1000) and Receiver Account ($500)" },
      { step: 3, action: "DEBIT SENDER", detail: `Deducted $${amount} from Sender Account (New balance: $${1000 - amount})` },
    ];

    if (shouldFail) {
      steps.push({
        step: 4,
        action: "NETWORK / CONSTRAINT ERROR",
        detail: "Simulated error during credit operation! Triggering Automatic ROLLBACK...",
      });
      steps.push({
        step: 5,
        action: "ABORT TRANSACTION",
        detail: "Atomicity enforced: Sender balance restored to $1000. No partial changes persisted.",
      });

      return res.status(200).json({
        success: true,
        committed: false,
        status: "ROLLED_BACK",
        isolationLevel,
        steps,
        acidBreakdown: {
          atomicity: "Enforced — All-or-nothing execution. Rolled back successfully.",
          consistency: "Enforced — Total system balance remains invariant ($1500).",
          isolation: `Enforced — Operations isolated using ${isolationLevel} locks.`,
          durability: "Enforced — Uncommitted changes discarded; committed state written to WAL.",
        },
      });
    }

    steps.push({ step: 4, action: "CREDIT RECEIVER", detail: `Added $${amount} to Receiver Account (New balance: $${500 + Number(amount)})` });
    steps.push({ step: 5, action: "COMMIT TRANSACTION", detail: "Persisted changes atomically to disk." });

    res.status(200).json({
      success: true,
      committed: true,
      status: "COMMITTED",
      isolationLevel,
      steps,
      acidBreakdown: {
        atomicity: "Enforced — Both debit and credit executed together.",
        consistency: "Enforced — System invariants ($1500 total) preserved.",
        isolation: `Enforced — ${isolationLevel} prevents dirty reads and race conditions.`,
        durability: "Enforced — Committed state written to write-ahead journal (redo log).",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Indexing Performance Analyzer
 */
exports.runIndexDemo = async (req, res) => {
  try {
    const { datasetSize = 100000, indexType = "B-Tree" } = req.body;

    const unindexedScanTime = (Math.random() * 45 + 15).toFixed(2); // ~15-60ms full scan
    let indexedScanTime = "0.42";

    if (indexType === "B-Tree") {
      indexedScanTime = (Math.random() * 0.8 + 0.2).toFixed(2); // ~0.2-1.0ms B-Tree
    } else if (indexType === "Hash") {
      indexedScanTime = (Math.random() * 0.3 + 0.1).toFixed(2); // ~0.1-0.4ms Hash lookup
    }

    const speedup = (unindexedScanTime / indexedScanTime).toFixed(1);

    res.status(200).json({
      success: true,
      datasetSize,
      indexType,
      unindexed: {
        executionTimeMs: unindexedScanTime,
        stage: "COLLSCAN (Full Collection Scan)",
        docsExamined: datasetSize,
        keysExamined: 0,
        complexity: "O(N)",
      },
      indexed: {
        executionTimeMs: indexedScanTime,
        stage: "IXSCAN (Index Scan)",
        docsExamined: 1,
        keysExamined: Math.ceil(Math.log2(datasetSize)),
        complexity: indexType === "B-Tree" ? "O(log N)" : "O(1)",
      },
      speedup: `${speedup}x faster`,
      explanation:
        indexType === "B-Tree"
          ? "B-Tree index allows binary search traversal down a balanced tree of depth log(N), bypassing 99.9% of collection documents."
          : "Hash index uses an O(1) hash function calculation for exact equality matches.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. CAP Theorem Simulator Endpoint
 */
exports.runCapDemo = async (req, res) => {
  try {
    const { partitionActive = true, systemChoice = "CP" } = req.body;

    if (!partitionActive) {
      return res.status(200).json({
        success: true,
        status: "NORMAL_OPERATION",
        systemChoice,
        message: "No network partition present. Both Consistency & Availability guaranteed (CA state).",
        consistency: "100% Guaranteed (Synchronous replication across all nodes)",
        availability: "100% Available for reads and writes",
      });
    }

    if (systemChoice === "CP") {
      return res.status(200).json({
        success: true,
        status: "PARTITION_ACTIVE",
        systemChoice: "CP (Consistency + Partition Tolerance)",
        tradeoff: "Sacrificed Availability for Strict Consistency",
        message: "Network split detected! Minor partition refuses writes to prevent stale data.",
        consistency: "Enforced — Stale reads rejected; only current data returned.",
        availability: "Reduced — Minority nodes return error (503 Service Unavailable) until partition heals.",
        examples: ["MongoDB (Primary/Secondary)", "HBase", "Redis Sentinel", "CockroachDB"],
      });
    }

    // AP Choice
    res.status(200).json({
      success: true,
      status: "PARTITION_ACTIVE",
      systemChoice: "AP (Availability + Partition Tolerance)",
      tradeoff: "Sacrificed Strict Consistency for High Availability",
      message: "Network split detected! All nodes respond immediately, but data may be temporarily inconsistent.",
      consistency: "Eventual Consistency — Nodes sync once network partition resolves.",
      availability: "100% Available — Every node accepts reads and writes without waiting for quorum.",
      examples: ["Apache Cassandra", "Amazon DynamoDB", "CouchDB"],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Normalization Engine (1NF -> 2NF -> 3NF)
 */
exports.runNormalizationDemo = async (req, res) => {
  try {
    const { stage = "3NF" } = req.body;

    const unnormalized = {
      tableName: "StudentCourses_UNF",
      columns: ["StudentID", "StudentName", "CourseID", "CourseName", "Instructor", "InstructorOffice"],
      issue: "Contains repeating groups, partial dependencies, and transitive dependencies.",
    };

    const firstNF = {
      tableName: "StudentCourses_1NF",
      columns: ["StudentID", "StudentName", "CourseID", "CourseName", "Instructor", "InstructorOffice"],
      primaryKey: ["StudentID", "CourseID"],
      rulesApplied: "Eliminated non-atomic values. Defined composite primary key (StudentID + CourseID).",
    };

    const secondNF = {
      tables: [
        {
          tableName: "Students",
          columns: ["StudentID", "StudentName"],
          primaryKey: "StudentID",
        },
        {
          tableName: "Courses",
          columns: ["CourseID", "CourseName", "Instructor", "InstructorOffice"],
          primaryKey: "CourseID",
        },
        {
          tableName: "StudentEnrollments",
          columns: ["StudentID", "CourseID"],
          primaryKey: ["StudentID", "CourseID"],
        },
      ],
      rulesApplied: "Removed Partial Dependencies. Attributes now depend on the ENTIRE primary key.",
    };

    const thirdNF = {
      tables: [
        {
          tableName: "Students",
          columns: ["StudentID", "StudentName"],
          primaryKey: "StudentID",
        },
        {
          tableName: "Courses",
          columns: ["CourseID", "CourseName", "InstructorID"],
          primaryKey: "CourseID",
          foreignKey: "InstructorID -> Instructors.InstructorID",
        },
        {
          tableName: "Instructors",
          columns: ["InstructorID", "InstructorName", "OfficeRoom"],
          primaryKey: "InstructorID",
        },
        {
          tableName: "StudentEnrollments",
          columns: ["StudentID", "CourseID"],
          primaryKey: ["StudentID", "CourseID"],
        },
      ],
      rulesApplied: "Removed Transitive Dependencies (CourseID -> Instructor -> OfficeRoom). Every non-prime attribute now depends SOLELY on the Key!",
    };

    res.status(200).json({
      success: true,
      stage,
      data: stage === "UNF" ? unnormalized : stage === "1NF" ? firstNF : stage === "2NF" ? secondNF : thirdNF,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
