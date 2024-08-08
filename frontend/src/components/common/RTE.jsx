import React from "react";
import { Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  BlockQuote,
  Link,
  List,
  Indent,
  TodoList,
  FontColor,
  Enter,
  SelectAll,
  Typing,
  ShiftEnter,
  FontFamily,
  Highlight,
  Font,
  Subscript,
  Superscript,
  Strikethrough,
  Code,
  CodeBlock,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="editor-container">
      {label && <label>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: {
                items: [
                  "undo",
                  "redo",
                  "|",
                  "heading",
                  "|",
                  "fontsize",
                  "fontfamily",
                  "highlight",
                  "fontColor",
                  "fontBackgroundColor",
                  "|",
                  "bold",
                  "italic",
                  "strikethrough",
                  "subscript",
                  "superscript",
                  "code",
                  "|",
                  "link",
                  "blockQuote",
                  "codeBlock",
                  "|",
                  "bulletedList",
                  "numberedList",
                  "todoList",
                  "outdent",
                  "indent",
                ],
              },
              plugins: [
                Bold,
                Essentials,
                Italic,
                Mention,
                Paragraph,
                Undo,
                Heading,
                BlockQuote,
                Link,
                List,
                Indent,
                TodoList,
                FontColor,
                Enter,
                SelectAll,
                Typing,
                ShiftEnter,
                FontFamily,
                Highlight,
                Font,
                Subscript,
                Superscript,
                Strikethrough,
                Code,
                CodeBlock,
              ],
              // licenseKey: "<YOUR_LICENSE_KEY>",
              mention: {
                // Mention configuration
              },
              placeholder: "Your Blog Content",
              menuBar: {
                isVisible: true,
              },
              // initialData: { defaultValue },
            }}
            onChange={(event,editor)=>{
              const data = editor.getData();
              onChange(data)
              
            }}
          />
        )}
      />
    </div>
  );
}

export default RTE;
