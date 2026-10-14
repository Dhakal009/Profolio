import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './routes/Home';
import ProjectDemo from './routes/ProjectDemo';
import ProjectGallery from './ProjectGallery/ProjectGallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectGallery />} />
        <Route path="/projects/:id" element={<ProjectGallery />} />
        </Route>
        <Route path="/demo/:projectId" element={<ProjectDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;