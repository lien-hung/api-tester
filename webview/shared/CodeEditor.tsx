import { Editor, Monaco } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { COMMON, OPTION, REQUEST, RESPONSE } from "../constants";
import ResponsePreview from "../features/Response/Preview/ResponsePreview";

interface ICodeEditorProps {
  language: string;
  viewOption?: string;
  requestForm?: boolean;
  previewMode?: boolean;
  editorOption: any;
  editorWidth: string;
  codeEditorValue: string;
  shouldBeautifyEditor?: boolean;
  handleEditorChange?: (value: string | undefined) => void;
  handleBeautifyButton?: () => void;
}

function CodeEditor({
  language,
  viewOption,
  requestForm,
  previewMode,
  editorOption,
  editorWidth,
  codeEditorValue,
  shouldBeautifyEditor,
  handleEditorChange,
  handleBeautifyButton,
}: ICodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco>(null);

  const setEditorTheme = () => {
    if (!monacoRef.current) {
      return;
    }

    const currentEditor = document.querySelector("body");
    if (!currentEditor) {
      return;
    }

    const currentStyles = window.getComputedStyle(currentEditor);
    monacoRef.current.editor.defineTheme("currentTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        // Foreground and background
        "foreground": currentStyles.getPropertyValue("--vscode-foreground"),
        "editor.foreground": currentStyles.getPropertyValue("--vscode-editor-foreground"),
        "editor.background": currentStyles.getPropertyValue("--vscode-editor-background"),
        
        // Cursor
        "editorCursor.foreground": currentStyles.getPropertyValue("--vscode-editorCursor-foreground"),
        
        // Line numbers
        "editorLineNumber.foreground": currentStyles.getPropertyValue("--vscode-editorLineNumber-foreground"),
        "editorLineNumber.activeForeground": currentStyles.getPropertyValue("--vscode-editorLineNumber-activeForeground"),

        // Suggest widget (IntelliSense)
        "editorSuggestWidget.background": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-background"),
        "editorSuggestWidget.border": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-border"),
        "editorSuggestWidget.foreground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-foreground"),
        "editorSuggestWidget.selectedBackground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-selectedBackground"),
        "editorSuggestWidget.highlightForeground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-highlightForeground"),
        
        // Hover widget (variable/prop/method info etc.)
        "editorHoverWidget.background": currentStyles.getPropertyValue("--vscode-editorHoverWidget-background"),
        "editorHoverWidget.highlightForeground": currentStyles.getPropertyValue("--vscode-editorHoverWidget-highlightForeground"),

        // Text selection
        "selection.background": currentStyles.getPropertyValue("--vscode-selection-background"),
      }
    });
    monacoRef.current.editor.setTheme("currentTheme");
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorTheme();
  };

  const handleExtensionMessage = (event: MessageEvent) => {
    if (event.data.type === COMMON.THEME_CHANGED) {
      setEditorTheme();
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
  }, []);

  useEffect(() => {
    if (shouldBeautifyEditor && requestForm) {
      if (handleBeautifyButton) {
        handleBeautifyButton();
      }

      setTimeout(async () => {
        await editorRef.current.getAction("editor.action.formatDocument").run();
      }, 200);
    }
  }, [shouldBeautifyEditor]);

  useEffect(() => {
    if (requestForm || !previewMode || viewOption === RESPONSE.PREVIEW) return;

    if (editorRef.current?.getValue() !== codeEditorValue) {
      editorRef.current?.setValue(codeEditorValue);
    }

    setTimeout(async () => {
      editorRef.current?.updateOptions(OPTION.READ_ONLY_FALSE_OPTION);

      await editorRef.current?.getAction("editor.action.formatDocument").run();

      if (viewOption === REQUEST.RAW) {
        editorRef.current?.updateOptions(OPTION.LINE_NUMBER_OPTION);
      } else {
        editorRef.current?.updateOptions(OPTION.READ_ONLY_TRUE_OPTION);
      }
    }, 300);
  }, [viewOption, language]);

  return (
    <EditorWrapper>
      {viewOption === RESPONSE.PREVIEW && previewMode ? (
        <ResponsePreview sourceCode={codeEditorValue} />
      ) : (
        <Editor
          width={editorWidth}
          height="100%"
          language={language}
          value={codeEditorValue}
          options={editorOption}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      )}
    </EditorWrapper>
  );
};

const EditorWrapper = styled.div`
  flex: 0 1 auto;
  margin-top: 2rem;
  border: 0.1rem solid grey;
  border-radius: 0.4rem;
  height: 100%;

  .monaco-editor {
    .suggest-widget, .suggest-details {
      border: var(--vscode-editorHoverWidget-border);
    }

    .view-overlays {
      .current-line {
        background-color: var(--vscode-editor-lineHighlightBackground);
      }
      .current-line-exact {
        border: var(--vscode-editor-lineHighlightBorder);
      }
    }
  }
`;

export default CodeEditor;