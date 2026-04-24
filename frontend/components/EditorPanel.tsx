import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface EditorPanelProps {
  code: string;
  onCodeChange: (value: string | undefined) => void;
  readOnly?: boolean;
  language?: string;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  code,
  onCodeChange,
  readOnly = false,
  language = 'javascript'
}) => {
  // Handle Monaco editor mount to disable browser shortcuts
  const handleEditorMount: OnMount = (editor, monaco) => {
    // Disable Ctrl+P (Print) by overriding the command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      // Do nothing - prevents browser print dialog
    });

    // Disable Ctrl+S (Save) to prevent browser save dialog
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Could trigger a save action here if needed
    });

    // Disable Ctrl+Shift+P to prevent browser print dialog
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
      // Do nothing
    });
  };

  return (
    <div className="bg-transparent rounded-lg overflow-hidden h-full border border-white/5 relative">
      <div className="absolute inset-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            readOnly: readOnly,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            // automaticLayout: true, // Already defined above or handled by default
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
