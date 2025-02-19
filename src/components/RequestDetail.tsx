import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { resendRequest } from "../lib/api";

interface RequestDetailProps {
  request: any;
}

export default function RequestDetail({ request }: RequestDetailProps) {
  const [method, setMethod] = useState(request.method);
  const [url, setUrl] = useState(request.url);
  const [body, setBody] = useState(
    JSON.stringify(request.body || {}, null, 2)
  );

  const handleResend = async () => {
    try {
      const response = await resendRequest({
        method,
        url,
        body: JSON.parse(body),
        headers: request.headers,
      });
      console.log('Response:', response);
    } catch (error) {
      console.error('Error resending request:', error);
    }
  };

  return (
    <div className="w-1/2 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Request Body</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono"
              rows={10}
            />
          </div>

          <Button onClick={handleResend}>
            Resend Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 