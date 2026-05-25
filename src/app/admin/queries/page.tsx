"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Eye,
  MessageSquare,
  User,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getQueries, updateQueryStatus } from "@/actions/query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select as FormSelect, 
  SelectContent as FormSelectContent, 
  SelectItem as FormSelectItem, 
  SelectTrigger as FormSelectTrigger, 
  SelectValue as FormSelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function QueriesPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.users || { view: false, create: false, edit: false, delete: false };
  const canEdit = isSuperAdmin || permissions.edit;

  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState<string>("PENDING");
  const [adminNotesInput, setAdminNotesInput] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  async function fetchQueries() {
    setLoading(true);
    try {
      const result = await getQueries({});
      if (result.success) {
        setQueries(result.queries);
      }
    } catch (error) {
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (query: any) => {
    setSelectedQuery(query);
    setStatusInput(query.status);
    setAdminNotesInput(query.adminNotes || "");
    setIsModalOpen(true);
  };

  const handleQuickStatusUpdate = async (id: string, status: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to update queries.");
      return;
    }
    try {
      const result = await updateQueryStatus(id, status);
      if (result.success) {
        toast.success(`Query marked as ${status.replace("_", " ")}`);
        fetchQueries();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuery) return;
    if (!canEdit) {
      toast.error("You do not have permission to update queries.");
      return;
    }
    setUpdating(true);
    try {
      const result = await updateQueryStatus(selectedQuery._id, statusInput, adminNotesInput);
      if (result.success) {
        toast.success("Query updated successfully");
        setIsModalOpen(false);
        fetchQueries();
      } else {
        toast.error(result.error || "Failed to update query");
      }
    } catch (error) {
      toast.error("Failed to update query");
    } finally {
      setUpdating(false);
    }
  };

  const filteredQueries = queries.filter(q => {
    const term = searchTerm.toLowerCase();
    return (
      (q.name && q.name.toLowerCase().includes(term)) ||
      (q.email && q.email.toLowerCase().includes(term)) ||
      (q.subject && q.subject.toLowerCase().includes(term)) ||
      (q.message && q.message.toLowerCase().includes(term))
    );
  });

  const pendingCount = queries.filter(q => q.status === "PENDING").length;
  const inProgressCount = queries.filter(q => q.status === "IN_PROGRESS").length;
  const resolvedCount = queries.filter(q => q.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Queries</h1>
          <p className="text-muted-foreground">Review and respond to messages submitted via the contact form.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold">{inProgressCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <h3 className="text-2xl font-bold">{resolvedCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search queries..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message Snippet</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filteredQueries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No customer queries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueries.map((query) => (
                  <TableRow key={query._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{query.name}</span>
                        <span className="text-xs text-muted-foreground">{query.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{query.subject}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate text-muted-foreground">
                      {query.message}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(query.createdAt), "MMM dd, yyyy p")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        query.status === "PENDING" && "bg-amber-100 text-amber-700 hover:bg-amber-100",
                        query.status === "IN_PROGRESS" && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                        query.status === "RESOLVED" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                        query.status === "CLOSED" && "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      )}>
                        {query.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => handleOpenModal(query)}>
                            <Eye className="mr-2 h-4 w-4" /> View & Respond
                          </DropdownMenuItem>
                           {canEdit && query.status === "PENDING" && (
                            <DropdownMenuItem onClick={() => handleQuickStatusUpdate(query._id, "IN_PROGRESS")}>
                              <MessageSquare className="mr-2 h-4 w-4 text-blue-600" /> Mark In Progress
                            </DropdownMenuItem>
                          )}
                          {canEdit && query.status !== "RESOLVED" && (
                            <DropdownMenuItem onClick={() => handleQuickStatusUpdate(query._id, "RESOLVED")}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Mark Resolved
                            </DropdownMenuItem>
                          )}
                          {canEdit && query.status !== "CLOSED" && (
                            <DropdownMenuItem onClick={() => handleQuickStatusUpdate(query._id, "CLOSED")}>
                              <XCircle className="mr-2 h-4 w-4 text-gray-600" /> Close Query
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Query Details
            </DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <form onSubmit={handleSaveModal} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <User size={14} /> Customer Name
                  </div>
                  <div className="font-semibold text-sm">{selectedQuery.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Mail size={14} /> Email Address
                  </div>
                  <div className="font-semibold text-sm">{selectedQuery.email}</div>
                </div>
                {selectedQuery.phone && (
                  <div className="space-y-1 col-span-2 border-t pt-2 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Phone size={14} /> Phone Number
                    </div>
                    <div className="font-semibold text-sm">{selectedQuery.phone}</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</Label>
                <div className="font-medium text-base bg-background p-3 rounded-md border">
                  {selectedQuery.subject}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer Message</Label>
                <div className="text-sm bg-background p-4 rounded-md border whitespace-pre-wrap leading-relaxed">
                  {selectedQuery.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Query Status</Label>
                  <FormSelect 
                    name="status" 
                    value={statusInput} 
                    onValueChange={(value) => setStatusInput(value ?? statusInput)}
                    disabled={!canEdit}
                  >
                    <FormSelectTrigger>
                      <FormSelectValue placeholder="Select status" />
                    </FormSelectTrigger>
                    <FormSelectContent>
                      <FormSelectItem value="PENDING">Pending</FormSelectItem>
                      <FormSelectItem value="IN_PROGRESS">In Progress</FormSelectItem>
                      <FormSelectItem value="RESOLVED">Resolved</FormSelectItem>
                      <FormSelectItem value="CLOSED">Closed</FormSelectItem>
                    </FormSelectContent>
                  </FormSelect>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes / Resolution Details</Label>
                <Textarea 
                  id="adminNotes" 
                  placeholder={canEdit ? "Add internal notes or record how this query was resolved..." : "No resolution notes added."}
                  rows={4}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant={canEdit ? "outline" : "default"} onClick={() => setIsModalOpen(false)}>
                  {canEdit ? "Cancel" : "Close"}
                </Button>
                {canEdit && (
                  <Button type="submit" disabled={updating}>
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
