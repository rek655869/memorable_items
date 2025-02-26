import { createRoot } from 'react-dom/client';
import DeleteSidebar from './components/DeleteSidebar';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<DeleteSidebar />);
