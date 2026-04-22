import './App.css';
import MovieHeader from './components/movieheader';
import MovieList from './components/movielist';
import MovieDetail from './components/moviedetail'; // <-- CHANGED THIS LINE
import Authentication from './components/authentication';
import {HashRouter, Routes,  Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <MovieHeader />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movielist" element={<MovieList />}/>
          
          {/* CHANGED THIS LINE TO USE THE FIXED COMPONENT */}
          <Route path="/movie/:movieId" element={<MovieDetail />}/> 
          
          <Route path="/signin" element={<Authentication />}/>
          {/*... other routes */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;