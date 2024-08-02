import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";

// Define props interface for the component
interface GeneratedCodeProps {
  code: string;
}

export default function GeneratedCode({ code }: GeneratedCodeProps) {
  // Reference to the editor instance
  const editorRef = useRef<any | null>(null);

  // Callback when the editor is mounted
  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Handle code download
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "generated_code.py";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  // Render the generated code component
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Python Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          height="50vh"
          language="python"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            theme: "vs-dark",
            fontSize: 14,
            fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onMount={onMount}
          className="rounded-md border"
        />
        <Button onClick={handleDownload} className="mt-4">
          Download Code
        </Button>
      </CardContent>
    </Card>
  );
}
