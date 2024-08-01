"use client";

import { useState, useEffect } from "react";
import APIDocumentForm from "@/components/APIDocumentForm";
import GeneratedCode from "@/components/GeneratedCode";
import APIData from "@/components/APIData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Code, Database } from "lucide-react";

interface APIDataType {
  id: number;
  file_path: string;
  created_at: string;
  data: string;
  generated_code: {
    id: number;
    code: string;
    created_at: string;
  };
}

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [apiData, setApiData] = useState<APIDataType | null>(null);

  useEffect(() => {
    fetchLatestAPIData();
  }, []);

  const fetchLatestAPIData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api-data/");
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      }
    } catch (error) {
      console.error("Failed to fetch latest API data", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">API Interpreter</h1>
        <Separator className="mb-4" />
        <Card className="shadow-lg mb-4 overflow-hidden">
          <CardHeader className="bg-blue-600 text-white py-2">
            <CardTitle className="text-lg sm:text-xl">Generate API Code</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <APIDocumentForm onCodeGenerated={setGeneratedCode} />
          </CardContent>
        </Card>
        <Tabs defaultValue="generated-code" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="generated-code" className="flex items-center justify-center gap-2 text-sm">
              <Code className="w-4 h-4" /> Code
            </TabsTrigger>
            <TabsTrigger value="api-data" className="flex items-center justify-center gap-2 text-sm">
              <Database className="w-4 h-4" /> API Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generated-code">
            <Card className="shadow-lg">
              <CardContent className="p-3 sm:p-4">
                {generatedCode ? (
                  <GeneratedCode code={generatedCode} />
                ) : (
                  <p className="text-gray-500 text-center py-2 text-sm">
                    No code generated. Submit form to generate.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="api-data">
            <Card className="shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <APIData apiData={apiData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}