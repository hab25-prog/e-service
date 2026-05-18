import React, { useState } from "react";
import { supabase } from "../service/supaBaseConf";
import useAuth from "../context/useAuth";

export default function DebugSubscription() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null);

  const addLog = (message) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testSubscriptionInsert = async () => {
    try {
      if (!user?.id) {
        addLog("ERROR: No user logged in");
        return;
      }

      addLog("Starting subscription insert test...");
      addLog(`User ID: ${user.id}`);

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const testData = {
        user_id: user.id,
        plan_type: "test_professional",
        price: 200,
        status: "active",
        end_date: endDate.toISOString(),
        tx_ref: `test-${Date.now()}`,
      };

      addLog("Inserting test subscription:");
      addLog(JSON.stringify(testData, null, 2));

      const { data, error } = await supabase
        .from("subscriptions")
        .insert([testData])
        .select()
        .single();

      if (error) {
        addLog(`ERROR during insert: ${error.message}`);
        addLog(`Error details: ${JSON.stringify(error, null, 2)}`);
        setTestResult({ success: false, error: error.message });
      } else {
        addLog("SUCCESS! Data inserted:");
        addLog(JSON.stringify(data, null, 2));
        setTestResult({ success: true, data });
      }
    } catch (err) {
      addLog(`CATCH ERROR: ${err.message}`);
      setTestResult({ success: false, error: err.message });
    }
  };

  const testFetchSubscription = async () => {
    try {
      if (!user?.id) {
        addLog("ERROR: No user logged in");
        return;
      }

      addLog("Fetching subscriptions for user...");

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        addLog(`ERROR during fetch: ${error.message}`);
        setTestResult({ success: false, error: error.message });
      } else {
        addLog("SUCCESS! Subscriptions found:");
        addLog(JSON.stringify(data, null, 2));
        setTestResult({ success: true, data });
      }
    } catch (err) {
      addLog(`CATCH ERROR: ${err.message}`);
      setTestResult({ success: false, error: err.message });
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">Subscription Debug Tool</h1>

        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>Current User:</strong> {user?.id || "Not logged in"}
          </p>
          <p className="text-sm">
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={testSubscriptionInsert}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Insert Subscription
          </button>
          <button
            onClick={testFetchSubscription}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Fetch Subscriptions
          </button>
          <button
            onClick={() => {
              setLogs([]);
              setTestResult(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        {testResult && (
          <div
            className={`mb-6 p-4 rounded ${
              testResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p className="font-bold mb-2">
              {testResult.success ? "✓ Success" : "✗ Error"}
            </p>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-50 rounded p-4 border">
          <h3 className="font-bold mb-3">Console Logs:</h3>
          <div className="font-mono text-xs bg-black text-green-400 p-3 rounded overflow-auto max-h-96">
            {logs.length === 0 ? (
              <p>No logs yet...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
