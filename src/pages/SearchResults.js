import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMealsByCategory, getMealsByArea } from '../utils/APIMealDB';
import LoadingSpinner from '../components/LoadingSpinner';
import MealCard from '../components/MealCard';
import './SearchResults.css';

function SearchResults() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Résultats de la recherche par nom (passés via state)
    const results = location.state?.results || { startsWith: [], contains: [] };
    const allSearchResults = [...results.startsWith, ...results.contains];

    // Paramètres de filtre depuis l'URL
    const categoryParam = searchParams.get('category');
    const areaParam = searchParams.get('area');

    // Effectuer le fetch si on a des paramètres de filtre
    useEffect(() => {
        const fetchFilteredMeals = async () => {
            setLoading(true);
            try { // condition si l'input est une catégorie ou un pays(condition speciale auquel cas)
                if (categoryParam) {
                    const meals = await getMealsByCategory(categoryParam);
                    setFilteredMeals(meals);
                } else if (areaParam) {
                    const meals = await getMealsByArea(areaParam);
                    setFilteredMeals(meals);
                }
            } catch (error) {
                console.error('Erreur lors du filtrage:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryParam || areaParam) {
            fetchFilteredMeals();
        }
    }, [categoryParam, areaParam]);

    // Détermine quels résultats afficher
    const displayMeals = (categoryParam || areaParam) ? filteredMeals : allSearchResults;
    const hasFilters = categoryParam || areaParam;

    // Titre dynamique
    const getTitle = () => {
        if (categoryParam) return `Recettes - ${categoryParam}`;
        if (areaParam) return `Recettes - Cuisine ${areaParam}`;
        return 'Résultats de recherche';
    };

    if (loading) return <LoadingSpinner message="Chargement des recettes..." />;

    return (
        <div className="search-results container mt-4">
            <h1>{getTitle()}</h1>

            {hasFilters && (
                <Link to="/display" className="btn btn-outline-secondary mb-3">
                    ← Retour aux catégories
                </Link>
            )}

            {displayMeals.length === 0 ? (
                <div className="alert alert-info">
                    <p>Aucun résultat trouvé. Veuillez effectuer une recherche depuis la barre de recherche.</p>
                    <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
                </div>
            ) : (
                <>
                    <p className="text-muted mb-4">{displayMeals.length} résultat(s) trouvé(s)</p>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {displayMeals.map((meal) => (
                            <MealCard key={meal.idMeal} meal={meal} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchResults;
