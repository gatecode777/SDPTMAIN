"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import {
  Activity,
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Plus,
  Minus,
  LogIn,
  Shield,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Tag,
  Image,
  Settings,
  BarChart3,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getActivityLogs, getLogAdmins, clearActivityLogs } from "@/actions/activity-logs";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ─── Helpers ────────────────────────────────────────────────────────────────
const MODULE_META: Record<string, { label: string; color: string; icon: any }> = {
  products:   { label: "Products",   color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",   icon: ShoppingBag },
  categories: { label: "Categories", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400", icon: Layers },
  orders:     { label: "Orders",     color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", icon: ShoppingCart },
  customers:  { label: "Customers",  color: "bg-green-500/15 text-green-600 dark:text-green-400", icon: ShoppingCart },
  coupons:    { label: "Coupons",    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400",    icon: Tag },
  banner:     { label: "Banner",     color: "bg-teal-500/15 text-teal-600 dark:text-teal-400",    icon: Image },
  admins:     { label: "Admins",     color: "bg-orange-500/15 text-orange-600 dark:text-orange-400", icon: Shield },
  settings:   { label: "Settings",   color: "bg-slate-500/15 text-slate-600 dark:text-slate-400", icon: Settings },
  analytics:  { label: "Analytics",  color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400", icon: BarChart3 },
  queries:    { label: "Queries",    color: "bg-pink-500/15 text-pink-600 dark:text-pink-400",    icon: HelpCircle },
  auth:       { label: "Auth",       color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: LogIn },
  other:      { label: "Other",      color: "bg-gray-500/15 text-gray-600 dark:text-gray-400",    icon: Activity },
};

const ACTION_META: Record<string, { label: string; color: string; icon: any }> = {
  CREATE: { label: "Create", color: "bg-green-500/15 text-green-600 dark:text-green-400",  icon: Plus },
  UPDATE: { label: "Edit",   color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",  icon: Edit },
  DELETE: { label: "Delete", color: "bg-red-500/15 text-red-600 dark:text-red-400",        icon: Minus },
  VIEW:   { label: "View",   color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",     icon: Eye },
  LOGIN:  { label: "Login",  color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: LogIn },
  LOGOUT: { label: "Logout", color: "bg-slate-500/15 text-slate-600 dark:text-slate-400",  icon: LogIn },
  EXPORT: { label: "Export", color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400", icon: Download },
  OTHER:  { label: "Other",  color: "bg-gray-500/15 text-gray-600 dark:text-gray-400",     icon: Activity },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ActivityLogsPage() {
  const { data: session } = useSession();
  const isSuperAdmin =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";

  // State
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ viewCount: 0, editCount: 0, createCount: 0, deleteCount: 0, loginCount: 0 });

  // Filters
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const LIMIT = 30;

  const fetchLogs = useCallback(async (p = page, isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getActivityLogs({
        page: p,
        limit: LIMIT,
        adminId: adminFilter !== "all" ? adminFilter : undefined,
        module: moduleFilter !== "all" ? moduleFilter : undefined,
        action: actionFilter !== "all" ? actionFilter : undefined,
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      if (res.success) {
        setLogs(res.logs ?? []);
        setTotal(res.total ?? 0);
        setPages(res.pages ?? 1);
        setStats(res.stats ?? { viewCount: 0, editCount: 0, createCount: 0, deleteCount: 0, loginCount: 0 });
      } else {
        if (!isSilent) toast.error(res.error || "Failed to load logs");
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [page, adminFilter, moduleFilter, actionFilter, search, dateFrom, dateTo]);

  // Load admins for dropdown
  useEffect(() => {
    getLogAdmins().then((res) => {
      if (res.success) setAdmins(res.admins ?? []);
    });
  }, []);

  // Fetch on filter change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchLogs(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminFilter, moduleFilter, actionFilter, search, dateFrom, dateTo]);

  // Fetch when page changes
  useEffect(() => {
    fetchLogs(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs(page, true);
    }, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, [fetchLogs, page]);

  const handleClearAll = async () => {
    if (!confirm("Clear ALL activity logs? This action cannot be undone.")) return;
    const res = await clearActivityLogs();
    if (res.success) {
      toast.success("All logs cleared");
      fetchLogs(1);
    } else {
      toast.error(res.error || "Failed to clear logs");
    }
  };


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  // ─── Stat Cards ───────────────────────────────────────────────────────────
  const statCards = [
    { label: "SHOWN",   value: logs.length,       color: "text-foreground" },
    { label: "VIEW",    value: stats.viewCount,    color: "text-blue-500",    icon: Eye },
    { label: "EDIT",    value: stats.editCount,    color: "text-amber-500",   icon: Edit },
    { label: "CREATE",  value: stats.createCount,  color: "text-green-500",   icon: Plus },
    { label: "DELETE",  value: stats.deleteCount,  color: "text-red-500",     icon: Minus },
    { label: "LOGIN",   value: stats.loginCount,   color: "text-emerald-500", icon: LogIn },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            Activity Logs
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center flex-wrap gap-2">
            Track every action taken by admin accounts &mdash;{" "}
            <span className="font-semibold text-foreground">{total.toLocaleString()}</span> total entries
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live updates active
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin && (
            <Button variant="destructive" size="sm" onClick={handleClearAll} className="gap-2">
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <Card key={s.label} className="border-none shadow-sm bg-card/60">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              {s.icon && <s.icon className={`h-3.5 w-3.5 mx-auto mb-0.5 ${s.color}`} />}
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search description, target, admin name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Admin Filter */}
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={adminFilter}
          onChange={(e) => setAdminFilter(e.target.value)}
        >
          <option value="all">All Admins</option>
          {admins.map((a) => (
            <option key={String(a._id)} value={String(a._id)}>
              {a.name} ({a.email})
            </option>
          ))}
        </select>

        {/* Module Filter */}
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        >
          <option value="all">All Modules</option>
          {Object.entries(MODULE_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Action Filter */}
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="all">All Actions</option>
          {Object.entries(ACTION_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Date Range */}
        <input
          type="date"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="From date"
        />
        <input
          type="date"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="To date"
        />

        {/* Refresh */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchLogs(page)}
          title="Refresh"
          className={loading ? "animate-spin" : ""}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <Card className="border-none shadow-sm bg-card/60 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Admin</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Module</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Action</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Description</th>
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-muted rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium">No activity logs found</p>
                      <p className="text-sm mt-1">Actions performed by admin members will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const mod = MODULE_META[log.module] || MODULE_META.other;
                    const act = ACTION_META[log.action] || ACTION_META.OTHER;
                    const isExpanded = expandedRows.has(log._id);

                    return (
                      <Fragment key={log._id}>
                        <tr
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => toggleRow(log._id)}
                        >
                          {/* Time */}
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>

                          {/* Admin */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 text-xs">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                  {getInitials(log.adminName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm leading-tight truncate">{log.adminName}</p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {log.adminRole.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Module */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${mod.color}`}>
                              <mod.icon className="h-3 w-3" />
                              {mod.label}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${act.color}`}>
                              <act.icon className="h-3 w-3" />
                              {act.label}
                            </span>
                          </td>

                          {/* Description */}
                          <td className="px-4 py-3 max-w-sm">
                            <p className="text-sm text-foreground/90 truncate">{log.description}</p>
                            {log.targetName && (
                              <p className="text-[11px] text-muted-foreground truncate">
                                &rarr; {log.targetName}
                              </p>
                            )}
                          </td>

                          {/* Expand toggle */}
                          <td className="px-4 py-3 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </td>
                        </tr>

                        {/* Expanded Details Row */}
                        {isExpanded && (
                          <tr key={`${log._id}-expanded`} className="bg-muted/20">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                <div>
                                  <p className="text-muted-foreground uppercase tracking-wide mb-1">Admin Email</p>
                                  <p className="font-medium">{log.adminEmail}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground uppercase tracking-wide mb-1">Target ID</p>
                                  <p className="font-mono text-[10px] break-all">{log.targetId || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground uppercase tracking-wide mb-1">Full Description</p>
                                  <p className="font-medium">{log.description}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground uppercase tracking-wide mb-1">Log ID</p>
                                  <p className="font-mono text-[10px] break-all">{log._id}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pages} &middot; {total.toLocaleString()} entries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
