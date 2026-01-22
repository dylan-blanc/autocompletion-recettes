import './App.css';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import SearchResults from './pages/SearchResults';
import Display from './pages/Display';
import { House, Speedometer2, Table } from 'react-bootstrap-icons';
import SearchForFood from './components/SearchBar';

function App() {
  const [searchResults, setSearchResults] = useState({ startsWith: [], contains: [] });

  const handleSuggestionsChange = (suggestions) => {
    setSearchResults(suggestions);
  };

  return (

    <div className="App">

      <div className="px-3 py-2 bg-dark text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            {/* <a href="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
              <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
            </a> */}

            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              <li>
                <Link to="/" className="nav-link text-primary">
                  <House size={24} className="d-block mx-auto mb-1" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/Display" className="nav-link text-white">
                  <Speedometer2 size={24} className="d-block mx-auto mb-1" />
                  Toutes nos Recettes
                </Link>
              </li>
              {/* <li>
                <Link to="/recipe-details" className="nav-link text-white">
                  <Speedometer2 size={24} className="d-block mx-auto mb-1" />
                  RecipeDetails
                </Link>
              </li> */}
              <li>
                <Link to="/search-results" className="nav-link text-white">
                  <Table size={24} className="d-block mx-auto mb-1" />
                  SearchResults
                </Link>
              </li>
              {/* <li>
                <a href="#" className="nav-link text-white">
                  <svg className="bi d-block mx-auto mb-1" width="24" height="24"><use xlink:href="#grid"></use></svg>
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <svg className="bi d-block mx-auto mb-1" width="24" height="24"><use xlink:href="#people-circle"></use></svg>
                  Customers
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-bottom mb-3">
        <div className="container d-flex flex-wrap justify-content-center">
          <div className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto d-flex align-items-center">
            <SearchForFood onSuggestionsChange={handleSuggestionsChange} />
            <Link to="/search-results" state={{ results: searchResults }} id="GlobalSearchButton" className="btn btn-light text-dark ms-2">Rechercher</Link>
          </div>
          {/* <div className="text-end">
            <button type="button" className="btn btn-light text-dark me-2">Login</button>
            <button type="button" className="btn btn-primary">Sign-up</button>
          </div> */}
        </div>
      </div>

      {/* <header className="App-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/recipe-details">RecipeDetails</Link>
            </li>
            <li>
              <Link to="/search-results">SearchResults</Link>
            </li>
          </ul>
        </nav>
      </header> */}

      {/* Les Routes définissent quel composant afficher selon l'URL */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/Display" element={<Display />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
