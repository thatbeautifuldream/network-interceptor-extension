import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import RequestList from "./components/RequestList";
import RequestDetail from "./components/RequestDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { getRequests, clearRequests, listenToRequests } from "./lib/api";

const queryClient = new QueryClient();

// Add Request type
interface Request {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  status?: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  // Update the state type to Request | null
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    // Load initial requests
    getRequests().then(setRequests);

    // Listen for new requests
    listenToRequests(
      (newRequest) => {
        setRequests((prev) => [...prev, newRequest]);
      },
      (updatedRequest) => {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === updatedRequest.id ? updatedRequest : req
          )
        );
      }
    );
  }, []);

  const handleClearAll = async () => {
    await clearRequests();
    setRequests([]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col p-4 bg-background text-foreground">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">API Request Interceptor</h1>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </header>

        <div className="flex-1 space-y-4">
          <Input
            type="search"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <Tabs defaultValue="requests" className="flex-1">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent
              value="requests"
              className="flex space-x-4 h-[calc(100vh-200px)]"
            >
              <RequestList
                searchQuery={searchQuery}
                onSelectRequest={setSelectedRequest}
              />
              {selectedRequest && <RequestDetail request={selectedRequest} />}
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Settings</h2>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <Input type="checkbox" />
                    <span>Enable request interception</span>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
