import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, BarChart, Clock, Calendar } from "lucide-react";

interface Session {
  id: string;
  createdAt: string;
  endedAt: string | null;
  duration: number | null;
  dataPoints: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState<keyof Session>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const handleSort = (column: keyof Session) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedSessions = sessions
    ? [...sessions].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === null) return sortOrder === "asc" ? -1 : 1;
        if (bValue === null) return sortOrder === "asc" ? 1 : -1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return sortOrder === "asc" 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      })
    : [];

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Eye Tracking Sessions</h1>
          <Button onClick={() => setLocation("/home")}>New Session</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{sessions?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">
                  {sessions?.reduce((sum, session) => sum + session.dataPoints, 0) || 0}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">
                  {sessions && sessions.length > 0
                    ? `${Math.round(
                        sessions.reduce(
                          (sum, session) => sum + (session.duration || 0),
                          0
                        ) / sessions.filter(s => s.duration).length
                      )}s`
                    : "0s"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <p>Loading sessions...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      Session ID
                      {sortBy === "id" && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Date
                      {sortBy === "createdAt" && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("duration")}
                    >
                      Duration
                      {sortBy === "duration" && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("dataPoints")}
                    >
                      Data Points
                      {sortBy === "dataPoints" && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No sessions found. Start a new session to begin tracking.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">
                          {session.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(new Date(session.createdAt), "MMM d, yyyy h:mm a")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {session.duration ? `${session.duration}s` : "In progress"}
                        </TableCell>
                        <TableCell>{session.dataPoints}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/sessions/${session.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 