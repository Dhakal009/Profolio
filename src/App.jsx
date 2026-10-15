import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './routes/Home';
import Resume from './routes/Resume';
import ProjectDemo from './routes/ProjectDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
          <Route path="/projects/:id" element={<Navigate to="/#projects" replace />} />
          <Route path="/resume" element={<Resume />} />
        </Route>
        <Route path="/demo/:projectId" element={<ProjectDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;