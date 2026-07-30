"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Database,
  ShieldCheck,
  Table as TableIcon,
  Search,
  Zap,
  Network,
  Cpu,
  Server,
} from "lucide-react";

export default function DatabaseLabPage() {
  const [activeTab, setActiveTab] = useState("acid");

  // 1. ACID & Transactions State
  const [transferAmount, setTransferAmount] = useState(150);
  const [simulateError, setSimulateError] = useState(false);
  const [isolationLevel, setIsolationLevel] = useState("Read Committed");
  const [acidResult, setAcidResult] = useState(null);
  const [acidLoading, setAcidLoading] = useState(false);

  const handleRunAcid = async () => {
    setAcidLoading(true);
    try {
      const res = await apiPost("/api/v1/database-lab/acid-demo", {
        amount: Number(transferAmount),
        shouldFail: simulateError,
        isolationLevel,
      });
      if (res?.success) {
        setAcidResult(res);
        toast.success(res.committed ? "Transaction Committed Successfully!" : "Transaction Error: Rolled Back!");
      }
    } catch (e) {
      toast.error(e.message || "Failed to run ACID simulation");
    } finally {
      setAcidLoading(false);
    }
  };

  // 2. CAP Theorem State
  const [partitionActive, setPartitionActive] = useState(true);
  const [capSystem, setCapSystem] = useState("CP");
  const [capResult, setCapResult] = useState(null);
  const [capLoading, setCapLoading] = useState(false);

  const handleRunCap = async () => {
    setCapLoading(true);
    try {
      const res = await apiPost("/api/v1/database-lab/cap-demo", {
        partitionActive,
        systemChoice: capSystem,
      });
      if (res?.success) {
        setCapResult(res);
      }
    } catch (e) {
      toast.error("Failed to run CAP simulation");
    } finally {
      setCapLoading(false);
    }
  };

  // 3. Normalization (1NF/2NF/3NF) State
  const [normStage, setNormStage] = useState("3NF");
  const [normResult, setNormResult] = useState(null);
  const [normLoading, setNormLoading] = useState(false);

  const handleRunNorm = async (stageChoice) => {
    const targetStage = stageChoice || normStage;
    setNormStage(targetStage);
    setNormLoading(true);
    try {
      const res = await apiPost("/api/v1/database-lab/normalization-demo", {
        stage: targetStage,
      });
      if (res?.success) {
        setNormResult(res);
      }
    } catch (e) {
      toast.error("Failed to fetch normalization stage");
    } finally {
      setNormLoading(false);
    }
  };

  // 4. Indexing Basics State
  const [datasetSize, setDatasetSize] = useState(100000);
  const [indexType, setIndexType] = useState("B-Tree");
  const [indexResult, setIndexResult] = useState(null);
  const [indexLoading, setIndexLoading] = useState(false);

  const handleRunIndex = async () => {
    setIndexLoading(true);
    try {
      const res = await apiPost("/api/v1/database-lab/index-demo", {
        datasetSize: Number(datasetSize),
        indexType,
      });
      if (res?.success) {
        setIndexResult(res);
        toast.success(`Query Benchmark Completed! Speedup: ${res.speedup}`);
      }
    } catch (e) {
      toast.error("Failed to run indexing analysis");
    } finally {
      setIndexLoading(false);
    }
  };

  return (
    <AppLayout className="w-full">
      <div className="px-4 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                Interactive Engineering Suite
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight font-heading flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              Database Systems & Architecture Lab
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Master ACID Transactions, CAP Theorem, Database Normalization (1NF-3NF), Indexing algorithms, and Concurrency Locks.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-muted/60 p-1.5 rounded-2xl border border-border/50">
            <TabsTrigger value="acid" className="rounded-xl gap-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ACID & Transactions
            </TabsTrigger>
            <TabsTrigger value="cap" className="rounded-xl gap-2 font-bold text-xs">
              <Network className="w-4 h-4 text-purple-400" /> CAP Theorem
            </TabsTrigger>
            <TabsTrigger value="normalization" className="rounded-xl gap-2 font-bold text-xs">
              <TableIcon className="w-4 h-4 text-blue-400" /> 1NF / 2NF / 3NF
            </TabsTrigger>
            <TabsTrigger value="indexing" className="rounded-xl gap-2 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" /> Indexing Basics
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ACID & TRANSACTIONS */}
          <TabsContent value="acid" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Simulator Form (5 Cols) */}
              <Card className="lg:col-span-5 border-border/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ACID Money Transfer Simulator
                  </CardTitle>
                  <CardDescription>
                    Simulate atomic session transactions between Account A (Sender) and Account B (Receiver).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transfer Amount ($)</label>
                    <Input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      min={10}
                      max={1000}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Isolation Level</label>
                    <Select value={isolationLevel} onValueChange={setIsolationLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select isolation level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Read Uncommitted">Read Uncommitted (Lowest, allows dirty reads)</SelectItem>
                        <SelectItem value="Read Committed">Read Committed (Default, prevents dirty reads)</SelectItem>
                        <SelectItem value="Repeatable Read">Repeatable Read (Prevents non-repeatable reads)</SelectItem>
                        <SelectItem value="Serializable">Serializable (Strict, lock-based order)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/60">
                    <div>
                      <p className="text-xs font-bold text-foreground">Simulate Mid-Transaction Failure</p>
                      <p className="text-[11px] text-muted-foreground">Triggers automatic rollback to test Atomicity</p>
                    </div>
                    <Switch checked={simulateError} onCheckedChange={setSimulateError} />
                  </div>

                  <Button onClick={handleRunAcid} disabled={acidLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                    {acidLoading ? "Executing Session..." : "Execute Transaction"}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Step-by-Step Execution Output (7 Cols) */}
              <Card className="lg:col-span-7 border-border/60 shadow-lg bg-gradient-to-b from-card to-background">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      Execution Steps & Invariant Status
                    </span>
                    {acidResult && (
                      <Badge className={acidResult.committed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-destructive/10 text-destructive border-destructive/30"}>
                        {acidResult.status}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!acidResult ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Click &quot;Execute Transaction&quot; to inspect real-time transaction steps and ACID breakdown.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Step Timeline */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Step-by-Step Journal Log</p>
                        <div className="space-y-2">
                          {acidResult.steps.map((st) => (
                            <motion.div
                              key={st.step}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                                st.action.includes("ERROR") || st.action.includes("ABORT")
                                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                                  : st.action.includes("COMMIT")
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                  : "border-border/60 bg-card/60"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold px-2 py-0.5 rounded bg-muted text-[10px]">#{st.step}</span>
                                <span className="font-bold">{st.action}</span>
                              </div>
                              <span className="text-muted-foreground text-[11px] truncate max-w-xs">{st.detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* ACID Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-emerald-400">A — Atomicity:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{acidResult.acidBreakdown.atomicity}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-blue-400">C — Consistency:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{acidResult.acidBreakdown.consistency}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-purple-400">I — Isolation:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{acidResult.acidBreakdown.isolation}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-amber-400">D — Durability:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{acidResult.acidBreakdown.durability}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: CAP THEOREM */}
          <TabsContent value="cap" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 border-border/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-400" />
                    CAP Theorem Matrix
                  </CardTitle>
                  <CardDescription>
                    Explore trade-offs when a network partition (P) strikes distributed system nodes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Tradeoff Target</label>
                    <Select value={capSystem} onValueChange={setCapSystem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system trade-off" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CP">CP (Consistency + Partition Tolerance)</SelectItem>
                        <SelectItem value="AP">AP (Availability + Partition Tolerance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/60">
                    <div>
                      <p className="text-xs font-bold text-foreground">Trigger Network Partition (Split-Brain)</p>
                      <p className="text-[11px] text-muted-foreground">Simulates network link disconnection between data centers</p>
                    </div>
                    <Switch checked={partitionActive} onCheckedChange={setPartitionActive} />
                  </div>

                  <Button onClick={handleRunCap} disabled={capLoading} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold">
                    {capLoading ? "Simulating Network Split..." : "Simulate CAP Behavior"}
                  </Button>
                </CardContent>
              </Card>

              {/* CAP Interactive Result Card */}
              <Card className="lg:col-span-7 border-border/60 shadow-lg bg-gradient-to-b from-card to-background">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    Distributed Cluster Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!capResult ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Click &quot;Simulate CAP Behavior&quot; to test network partition responses across CP vs AP databases.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-purple-300 text-sm">{capResult.systemChoice}</span>
                          <Badge variant="outline" className="border-purple-400 text-purple-400">{capResult.status}</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{capResult.message}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-blue-400">Consistency Guarantee:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{capResult.consistency}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                          <span className="font-bold text-emerald-400">Availability Status:</span>
                          <p className="text-muted-foreground text-[11px] mt-1">{capResult.availability}</p>
                        </div>
                      </div>

                      {capResult.examples && (
                        <div className="pt-2">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Real-world Database Examples:</p>
                          <div className="flex flex-wrap gap-2">
                            {capResult.examples.map((ex) => (
                              <Badge key={ex} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                                {ex}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: NORMALIZATION (1NF / 2NF / 3NF) */}
          <TabsContent value="normalization" className="space-y-6">
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <TableIcon className="w-5 h-5 text-blue-400" />
                      Relational Normalization Engine
                    </CardTitle>
                    <CardDescription>
                      Step-by-step schema transformation from Unnormalized Form (UNF) to 3rd Normal Form (3NF).
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {["UNF", "1NF", "2NF", "3NF"].map((st) => (
                      <Button
                        key={st}
                        variant={normStage === st ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRunNorm(st)}
                        className="font-bold text-xs rounded-lg"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!normResult ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Select a normal form stage (UNF, 1NF, 2NF, 3NF) to inspect table decomposition.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
                      <span className="font-bold">Stage: {normResult.stage}</span>
                      {normResult.data.rulesApplied && <p className="text-muted-foreground text-[11px] mt-1">{normResult.data.rulesApplied}</p>}
                    </div>

                    {normResult.data.tables ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {normResult.data.tables.map((tb) => (
                          <div key={tb.tableName} className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs space-y-2">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                              <span className="font-bold text-foreground text-sm">{tb.tableName}</span>
                              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">PK: {Array.isArray(tb.primaryKey) ? tb.primaryKey.join("+") : tb.primaryKey}</Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-[11px]">Columns:</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {tb.columns.map((c) => (
                                  <span key={c} className="px-2 py-0.5 rounded bg-muted font-mono text-[11px]">{c}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs space-y-2">
                        <span className="font-bold text-foreground">{normResult.data.tableName}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {normResult.data.columns.map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded bg-muted font-mono text-[11px]">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: INDEXING BASICS */}
          <TabsContent value="indexing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 border-border/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Query Indexing Benchmark
                  </CardTitle>
                  <CardDescription>
                    Compare Full Collection Scan vs B-Tree & Hash Index lookup speeds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Documents in Collection</label>
                    <Select value={String(datasetSize)} onValueChange={(val) => setDatasetSize(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dataset size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">10,000 Documents</SelectItem>
                        <SelectItem value="100000">100,000 Documents</SelectItem>
                        <SelectItem value="1000000">1,000,000 Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Index Strategy</label>
                    <Select value={indexType} onValueChange={setIndexType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select index type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B-Tree">B-Tree Index (Range & Equality, O(log N))</SelectItem>
                        <SelectItem value="Hash">Hash Index (Exact Equality match, O(1))</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleRunIndex} disabled={indexLoading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
                    {indexLoading ? "Benchmarking..." : "Run Query Benchmark"}
                  </Button>
                </CardContent>
              </Card>

              {/* Execution Plan Stats Card */}
              <Card className="lg:col-span-7 border-border/60 shadow-lg bg-gradient-to-b from-card to-background">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-amber-400" />
                      Execution Plan Stats (`explain()`)
                    </span>
                    {indexResult && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                        ⚡ {indexResult.speedup}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!indexResult ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Click &quot;Run Query Benchmark&quot; to test performance speedups with indexes.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Unindexed */}
                        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 space-y-2 text-xs">
                          <span className="font-bold text-destructive text-sm">Unindexed Scan</span>
                          <div className="space-y-1 text-muted-foreground">
                            <p>Stage: <code className="text-foreground">{indexResult.unindexed.stage}</code></p>
                            <p>Time: <span className="font-bold text-destructive">{indexResult.unindexed.executionTimeMs} ms</span></p>
                            <p>Complexity: <span className="font-bold">{indexResult.unindexed.complexity}</span></p>
                            <p>Docs Examined: <span className="font-bold">{indexResult.unindexed.docsExamined.toLocaleString()}</span></p>
                          </div>
                        </div>

                        {/* Indexed */}
                        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2 text-xs">
                          <span className="font-bold text-emerald-400 text-sm">Indexed Scan ({indexResult.indexType})</span>
                          <div className="space-y-1 text-muted-foreground">
                            <p>Stage: <code className="text-foreground">{indexResult.indexed.stage}</code></p>
                            <p>Time: <span className="font-bold text-emerald-400">{indexResult.indexed.executionTimeMs} ms</span></p>
                            <p>Complexity: <span className="font-bold text-emerald-400">{indexResult.indexed.complexity}</span></p>
                            <p>Docs Examined: <span className="font-bold text-emerald-400">{indexResult.indexed.docsExamined}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-card border border-border/60 text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">Optimization Note: </span>
                        {indexResult.explanation}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
