"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ServerResponse {
  success?: boolean;
  message: string;
  error?: string;
}

interface ServerResponseAlertProps {
  response: ServerResponse | null;
}

export const ServerResponseAlert: React.FC<ServerResponseAlertProps> = ({
  response,
}) => {
  if (!response) return null;

  return (
    <Alert variant={response.success ? "default" : "destructive"}>
      {response.success ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription>{response.message}</AlertDescription>
    </Alert>
  );
};