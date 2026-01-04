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

    const currentEditor = document.querySelector("html");
    if (!currentEditor) {
      return;
    }

    const currentBody = currentEditor.querySelector("body");
    if (!currentBody) {
      return;
    }

    const currentStyles = window.getComputedStyle(currentEditor);
    monacoRef.current.editor.defineTheme("currentTheme", {
      base: currentBody.classList.contains("vscode-light") ? "vs" : "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        // Foreground and background
        "foreground": currentStyles.getPropertyValue("--vscode-foreground"),
        "editor.background": currentStyles.getPropertyValue("--vscode-editor-background"),
        
        // Cursor
        "editorCursor.foreground": currentStyles.getPropertyValue("--vscode-editorCursor-foreground"),
        
        // Line numbers
        "editorLineNumber.foreground": currentStyles.getPropertyValue("--vscode-editorLineNumber-foreground"),
        "editorLineNumber.activeForeground": currentStyles.getPropertyValue("--vscode-editorLineNumber-activeForeground"),

        // Suggest widget (IntelliSense)
        "editorSuggestWidget.background": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-background"),
        "editorSuggestWidget.foreground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-foreground"),
        "editorSuggestWidget.focusHighlightForeground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-focusHighlightForeground"),
        "editorSuggestWidget.highlightForeground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-highlightForeground"),
        "editorSuggestWidget.selectedBackground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-selectedBackground"),
        "editorSuggestWidget.selectedForeground": currentStyles.getPropertyValue("--vscode-editorSuggestWidget-selectedForeground"),
        
        // Sticky scroll
        "editorStickyScroll.shadow": "#00000022",

        // Hover widget (variable/prop/method info etc.)
        "editorHoverWidget.background": currentStyles.getPropertyValue("--vscode-editorHoverWidget-background"),
        "editorHoverWidget.focusHighlightForeground": currentStyles.getPropertyValue("--vscode-editorHoverWidget-focusHighlightForeground"),
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
  border: 0.1rem solid rgba(128, 128, 128, 0.7);
  border-radius: 0.4rem;
  height: 100%;

  .monaco-editor {
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