import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"
import { useEffect, useRef } from "preact/hooks"
import { javascript } from "@codemirror/lang-javascript"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"


export function Editor({ lang, hidden, code, onchange}: { lang: "html" | "css" | "js", hidden: boolean, code?: string, onchange?: (code: string) => void }) {
  let ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const view = new EditorView({
      doc: code,
      parent: ref.current,
      extensions: [basicSetup, EditorView.theme({
        "&": { height: "100%", overflow: "auto", fontSize: "0.875rem" }, // make editor scroll inside
        ".cm-scroller": { overflow: "auto" },      // enable scrolling
      }),
        lang === "html" ? html() : lang === "css" ? css() : javascript()
      ],
      dispatch: (tr) => {
        view.update([tr]); // apply transaction

        if (tr.docChanged) {
          const code = view.state.doc.toString();
          onchange && onchange(code)
          // you can call your own callback here
        }
      }
    })
    return () => view.destroy()
  })

  return (
    <>
      <div class={["editor", hidden && "hidden"].filter(Boolean).join(" ")} ref={ref}></div>
    </>
  )
}