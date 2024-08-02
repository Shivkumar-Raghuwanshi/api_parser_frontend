"use client"; // Indicates that this is a client-side component in Next.js

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Define props interface for the component
interface APIDocumentFormProps {
  onCodeGenerated: (code: string) => void;
}

export default function APIDocumentForm({ onCodeGenerated}: APIDocumentFormProps) {
  // State for form inputs and loading status
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/interpret/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const data = await response.json();
        onCodeGenerated(data.generated_code.code);
        toast({
          title: "Success",
          description: "API document interpreted successfully",
        });
        setTitle("");
        setContent("");
      } else {
        throw new Error("Failed to interpret API document");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to interpret API document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Interpret API Document</h2>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="API Document Title"
        required
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste API documentation here"
        required
        rows={10}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Interpreting..." : "Interpret"}
      </Button>
    </form>
  );
}
