import { createRoot } from 'react-dom/client';
import Search from './components/Search';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<Search />);
