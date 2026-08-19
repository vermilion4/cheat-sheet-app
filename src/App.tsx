import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import { getManifestSafe } from './lib/content'
import { getQuizManifestSafe } from './lib/quizzes'
import { Home } from './pages/Home'
import { Language } from './pages/Language'
import { Sheet } from './pages/Sheet'
import { Quizzes } from './pages/Quizzes'
import { QuizLanguage } from './pages/QuizLanguage'
import { QuizRunner } from './pages/QuizRunner'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import './app.css'

const { manifest, error } = getManifestSafe()
const { groups: quizGroups, error: quizError } = getQuizManifestSafe()

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

function QuizLanguageRoute() {
  const { language } = useParams()
  const group = quizGroups.find((g) => g.language === language)
  return group ? <QuizLanguage group={group} /> : <Navigate to="/quizzes" replace />
}

function QuizRunnerRoute() {
  const { language, slug } = useParams()
  const group = quizGroups.find((g) => g.language === language)
  const quiz = group?.quizzes.find((q) => q.slug === slug)
  return quiz ? <QuizRunner quiz={quiz} /> : <Navigate to="/quizzes" replace />
}

export default function App() {
  if (error || quizError) {
    return (
      <Layout>
        <div className="error-screen">
          <h1>Content failed to load</h1>
          <p>A content file couldn&apos;t be parsed. Details:</p>
          <pre>{error || quizError}</pre>
        </div>
      </Layout>
    )
  }
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home manifest={manifest} quizGroups={quizGroups} />} />
        <Route path="/lang/:language" element={<LanguageRoute />} />
        <Route path="/lang/:language/:slug" element={<SheetRoute />} />
        <Route path="/quizzes" element={<Quizzes groups={quizGroups} />} />
        <Route path="/quizzes/:language" element={<QuizLanguageRoute />} />
        <Route path="/quizzes/:language/:slug" element={<QuizRunnerRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
