"use client"; 

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define interfaces for the data structures
interface GeneratedCode {
  id: number;
  code: string;
  created_at: string;
}

interface APIData {
  id: number;
  file_path: string;
  created_at: string;
  data: string;
  generated_code?: GeneratedCode;
}

// Define props interface for the component
interface APIDataProps {
  apiData: APIData | null;
}

export default function APIData({ apiData }: APIDataProps) {
  // State to store the latest API data
  const [latestApiData, setLatestApiData] = useState<APIData | null>(null);

  // Effect to update state when props change or fetch data if not provided
  useEffect(() => {
    if (apiData) {
      setLatestApiData(apiData);
    } else {
      fetchLatestAPIData();
    }
  }, [apiData]);

  // Function to fetch the latest API data
  const fetchLatestAPIData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api-data/");
      if (response.ok) {
        const data = await response.json();
        setLatestApiData(data);
      }
    } catch (error) {
      console.error("Failed to fetch latest API data", error);
    }
  };

  // Function to handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/download-latest-csv/"
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `api_data_.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download CSV", error);
    }
  };

  // Render the component
  return (
    <div className="space-y-4">
      {latestApiData === null ? (
        <p>No API data available.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>API Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mr-2" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}