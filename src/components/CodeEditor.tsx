import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'

const extFor = (language: 'java' | 'javascript') =>
  language === 'java' ? [java()] : [javascript()]

export function CodeEditor({
  value,
  onChange,
  language,
}: {
  value: string
  onChange: (v: string) => void
  language: 'java' | 'javascript'
}) {
  const dark = document.documentElement.dataset.theme !== 'light'
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extFor(language)}
      theme={dark ? 'dark' : 'light'}
      basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
    />
  )
}
