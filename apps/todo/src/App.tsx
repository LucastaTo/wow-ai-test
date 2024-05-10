import { Suspense} from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import TodoPage from './pages/ErrorPage'

function App() {

  return (
    <>
      <Router>
          <Routes>
            <Route
              path='/'
              element={
                <Suspense fallback={<></>}>
                  <TodoPage />
                </Suspense>
              }
            />
            <Route
              path='*'
              element={
                <Suspense fallback={<></>}>
                  <ErrorPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
    </>
  )
}

export default App
