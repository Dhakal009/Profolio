import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./routes/Home'));
const Projects = lazy(() => import('./routes/Projects'));
const ProjectGallery = lazy(() => import('./ProjectGallery/ProjectGallery'));
const Resume = lazy(() => import('./routes/Resume'));
const ProjectDemo = lazy(() => import('./routes/ProjectDemo'));

function RouteFallback() {
  return (
    <div className="route-fallback" aria-hidden="true" />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/tunnel" element={<ProjectGallery />} />
            <Route path="/projects/:id" element={<ProjectGallery />} />
            <Route path="/resume" element={<Resume />} />
          </Route>
          <Route path="/demo/:projectId" element={<ProjectDemo />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;