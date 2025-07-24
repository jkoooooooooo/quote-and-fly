import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [tableCount, setTableCount] = useState<number>(0);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setError(null);

    try {
      // Test basic connection by trying to count tables
      const { data, error } = await supabase
        .from('flights')
        .select('id', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      setTableCount(data?.length || 0);
      setConnectionStatus('connected');
    } catch (err: any) {
      console.error('Supabase connection error:', err);
      setError(err.message || 'Unknown error');
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          Supabase Connection
        </CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Status:</span>
            {getStatusBadge()}
          </div>
          
          {connectionStatus === 'connected' && (
            <div className="text-sm text-muted-foreground">
              ✅ Successfully connected to Supabase database
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="space-y-2">
              <div className="text-sm text-red-600">
                ❌ Connection failed
              </div>
              {error && (
                <div className="text-xs text-muted-foreground bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={connectionStatus === 'checking'}
            className="w-full"
          >
            {connectionStatus === 'checking' ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};