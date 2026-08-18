import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { getManifestSafe } from './lib/content'
import { Home } from './pages/Home'
import { Language } from './pages/Language'
import { Sheet } from './pages/Sheet'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import './app.css'

const { manifest, error } = getManifestSafe()

function LanguageRoute() {
  const { language } = useParams()
  const group = manifest.find((g) => g.language === language)
  return group ? <Language group={group} /> : <Navigate to="/" replace />
}

function SheetRoute() {
  const { language, slug } = useParams()
  const group = manifest.find((g) => g.language === language)
  if (!group || !slug) return <Navigate to="/" replace />
  return <Sheet group={group} slug={slug} />
}

export default function App() {
  if (error) {
    return (
      <Layout>
        <h1>Content failed to load</h1>
        <p>The cheat-sheet content could not be loaded. Details:</p>
        <pre>{error}</pre>
      </Layout>
    )
  }
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home manifest={manifest} />} />
        <Route path="/lang/:language" element={<LanguageRoute />} />
        <Route path="/lang/:language/:slug" element={<SheetRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
