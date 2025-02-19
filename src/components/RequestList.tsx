import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface Request {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  status?: number;
}

interface RequestListProps {
  searchQuery: string;
  onSelectRequest: (request: Request) => void;
}

export default function RequestList({
  searchQuery,
  onSelectRequest,
}: RequestListProps) {
  const { data: requests = [] } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      // Fetch requests from chrome.storage.local
      const result = await chrome.storage.local.get("requests");
      return result.requests || [];
    },
  });

  const filteredRequests = requests.filter((request: Request) =>
    request.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="w-1/2 border rounded-md">
      <div className="space-y-2 p-4">
        {filteredRequests.map((request: Request) => (
          <Card
            key={request.id}
            className="p-3 cursor-pointer hover:bg-accent"
            onClick={() => onSelectRequest(request)}
          >
            <div className="flex items-center space-x-2">
              <Badge
                variant={request.method === "GET" ? "default" : "destructive"}
              >
                {request.method}
              </Badge>
              <span className="truncate text-sm">{request.url}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(request.timestamp).toLocaleTimeString()}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
