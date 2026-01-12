import { Editor, Monaco } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { COMMON, OPTION, REQUEST, RESPONSE } from "../constants";
import ResponsePreview from "../features/Response/Preview/ResponsePreview";
import { getCurrentTheme } from "../utils";
import { IEditorTheme } from "../utils/type";

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
  const currentThemeRef = useRef<IEditorTheme>(getCurrentTheme());

  const setEditorTheme = () => {
    if (!monacoRef.current) {
      return;
    }

    currentThemeRef.current = getCurrentTheme();
    monacoRef.current.editor.defineTheme("currentTheme", {
      base: currentThemeRef.current.base,
      inherit: true,
      rules: [],
      colors: currentThemeRef.current.colors,
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
  };

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
    }, 500);
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
          options={{
            ...editorOption,
            fontFamily: currentThemeRef.current.fontFamily
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      )}
    </EditorWrapper>
  );
};

const EditorWrapper = styled.div`
  flex: 1 1 auto;
  margin-top: 2rem;

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