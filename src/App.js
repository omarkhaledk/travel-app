import './App.css';
import HomePage from './pages/HomePage/index.tsx';

function App(props) {
  return (
    <div className="App">
      <HomePage {...props} />
    </div>
  );
}

export default App;
