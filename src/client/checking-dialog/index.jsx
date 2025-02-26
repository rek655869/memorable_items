import { createRoot } from 'react-dom/client';
import ProgressMenu from './components/ProgressMenu';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<ProgressMenu />);
