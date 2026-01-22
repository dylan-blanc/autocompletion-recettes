import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
    const location = useLocation();
    const results = location.state?.results || { startsWith: [], contains: [] };

    // Combiner tous les résultats
    const allResults = [...results.startsWith, ...results.contains];

    return (
        <div className="search-results container mt-4">
            <h1>Résultats de recherche</h1>

            {allResults.length === 0 ? (
                <div className="alert alert-info">
                    <p>Aucun résultat trouvé. Veuillez effectuer une recherche depuis la barre de recherche.</p>
                    <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
                </div>
            ) : (
                <>
                    <p className="text-muted mb-4">{allResults.length} résultat(s) trouvé(s)</p>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {allResults.map((meal) => (
                            <div className="col" key={meal.idMeal}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={meal.strMealThumb}
                                        alt={meal.strMeal}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{meal.strMeal}</h5>
                                        {meal.strCategory && (
                                            <p className="card-text text-muted">
                                                {meal.strCategory} - {meal.strArea}
                                            </p>
                                        )}
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <Link
                                            to={`/recipe-details/${meal.idMeal}`}
                                            className="btn btn-primary w-100"
                                        >
                                            Voir la recette
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchResults;
