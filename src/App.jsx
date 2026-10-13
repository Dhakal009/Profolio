import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './routes/Home';
import Projects from './routes/Projects';
import ProjectDemo from './routes/ProjectDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
        <Route path="/demo/:projectId" element={<ProjectDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;