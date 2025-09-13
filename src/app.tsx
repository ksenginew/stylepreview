import { useEffect, useRef, useState } from 'preact/hooks'
import { Editor } from './editor'
const HTML_EXAMPLE = `<button class="btn">Click me</button>`

const CSS_EXAMPLE = `.btn {
  background: #4a6fa5;
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}`

const JS_EXAMPLE = `let count = 0;
const btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
  count++;
  btn.textContent = "Clicked " + count + " times";
});
`

const INIT = `
// read messages
window.addEventListener("message", (event) => {
  if (event.data.type === "html") {
    document.body.innerHTML = event.data.code
  }
  if (event.data.type === "css") {
    const style = document.getElementById("headstyle")
    style.innerHTML = " "
    style.firstChild.data = event.data.code
  }
})
`

export function App() {
  const [tab, setTab] = useState(0)
  const iframe = useRef<HTMLIFrameElement>(null)
  let html = localStorage.getItem("html") || HTML_EXAMPLE
  let css = localStorage.getItem("css") || CSS_EXAMPLE
  let js = localStorage.getItem("js") || JS_EXAMPLE

  function changeCode(code: string, type: "html" | "css" | "js") {
    localStorage.setItem(type, code)
    if (type === "html") {
      html = code
      if (iframe.current) {
        iframe.current.contentWindow?.postMessage({ code, type }, "*")
      }
    }
    if (type === "css") {
      css = code
      if (iframe.current) {
        iframe.current.contentWindow?.postMessage({ code, type }, "*")
      }
    }
    if (type === "js") {
      js = code
      run()
    }
  }

  function run() {
    if (!iframe.current) return
    iframe.current.srcdoc = `<html><head><script>${INIT}</script><style id="headstyle">${css}</style></head><body>${html}</body><script>${js}</script></html>`
  }

  useEffect(() => run())

  return (
    <>
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="col-header">
              <button class={["btn", tab === 0 && "active"].filter(Boolean).join(" ")} onClick={() => setTab(0)}>HTML</button>
              <button class={["btn", tab === 1 && "active"].filter(Boolean).join(" ")} onClick={() => setTab(1)}>CSS</button>
              <button class={["btn", tab === 2 && "active"].filter(Boolean).join(" ")} onClick={() => setTab(2)}>JS</button>
            </div>
            <Editor onchange={(code) => changeCode(code, "html")} code={html} lang="html" hidden={tab !== 0} />
            <Editor onchange={(code) => changeCode(code, "css")} code={css} lang="css" hidden={tab !== 1} />
            <Editor onchange={(code) => changeCode(code, "js")} code={js} lang="js" hidden={tab !== 2} />
          </div>
          <div class="col">
            <iframe ref={iframe} class="preview"></iframe>
          </div>
        </div>
      </div>
    </>
  )
}
