import './App.css';
import Navbar from './components/Navbar';
import ProjectManagement from './components/TrelloManagement';

function App() {
  return (
    <div className="App">
     <Navbar/>
     <ProjectManagement/>
    </div>
  );
}

export default App;
