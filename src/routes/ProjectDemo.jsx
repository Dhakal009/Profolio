import { useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import EmsDemo from '../components/demos/EmsDemo';
import LiveChatDemo from '../components/demos/LiveChatDemo';
import EcommerceDemo from '../components/demos/EcommerceDemo';

const DEMO_COMPONENTS = {
  ems: EmsDemo,
  'live-chat': LiveChatDemo,
  'ecommerce-app': EcommerceDemo,
};

export default function ProjectDemo() {
  const { projectId } = useParams();

  const project =
    PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
  const DemoComponent = DEMO_COMPONENTS[project.id] || EmsDemo;

  return <DemoComponent />;
}
