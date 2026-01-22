import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Liste des pays/zones disponibles dans l'API TheMealDB
const AVAILABLE_AREAS = [
    "American", "British", "Canadian", "Chinese", "Croatian", "Dutch",
    "Egyptian", "Filipino", "French", "Greek", "Indian", "Irish",
    "Italian", "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican",
    "Moroccan", "Polish", "Portuguese", "Russian", "Spanish", "Thai",
    "Tunisian", "Turkish", "Ukrainian", "Vietnamese"
];

function SearchForFood({ onSuggestionsChange }) {

    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState({
        startsWith: [],
        contains: []
    });
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchMode, setSearchMode] = useState('name'); // 'name' ou 'area'


    const filterSuggestions = (meals, query) => {
        const lowerQuery = query.toLowerCase();
        const startsWith = meals.filter(meal => meal.strMeal.toLowerCase().startsWith(lowerQuery)).slice(0, 5);
        const contains = meals.filter(meal => {
            const name = meal.strMeal.toLowerCase();
            return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
        }).slice(0, 5);

        return { startsWith, contains };
    };

    const getingredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredients${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients;
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();
                setRecipes(data.meals || []);
            }
            catch (error) {
                console.error("Erreur : ", error);
            }
        };
        if (query) fetchRecipes();
    }, [query]);

    // Remonter les suggestions au parent quand elles changent
    useEffect(() => {
        if (onSuggestionsChange) {
            onSuggestionsChange(suggestions);
        }
    }, [suggestions, onSuggestionsChange]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length > 2) {
                fetchSuggestions(searchTerm);
            }
        }, 300);
        return () => clearTimeout(timer)
    }, [searchTerm]);


    const navigateWithKeyboard = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                Math.min(prev + 1, suggestions.length - 1)
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            handleSelect(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };


    // Vérifie si le terme correspond à un pays (area)
    const findMatchingArea = (term) => {
        const lowerTerm = term.toLowerCase();
        return AVAILABLE_AREAS.find(area => area.toLowerCase() === lowerTerm);
    };

    const fetchSuggestions = async (term) => {
        setLoading(true);
        try {
            const matchedArea = findMatchingArea(term);

            if (matchedArea) {
                // Recherche par pays/area
                setSearchMode('area');
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${matchedArea}`);
                const data = await response.json();
                if (data.meals) {
                    // L'API filter ne renvoie que idMeal, strMeal, strMealThumb
                    // On met tous les résultats dans startsWith pour simplifier
                    setSuggestions({
                        startsWith: data.meals.map(meal => ({
                            ...meal,
                            strArea: matchedArea,
                            strCategory: 'Plat ' + matchedArea
                        })).slice(0, 10),
                        contains: []
                    });
                    setShowSuggestions(true);
                } else {
                    // Aucun résultat trouvé - vider les suggestions
                    setSuggestions({ startsWith: [], contains: [] });
                    setShowSuggestions(false);
                }
            } else {
                // Recherche par nom de plat
                setSearchMode('name');
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
                const data = await response.json();
                if (data.meals) {
                    setSuggestions(filterSuggestions(data.meals, term));
                    setShowSuggestions(true);
                } else {
                    // Aucun résultat trouvé - vider les suggestions
                    setSuggestions({ startsWith: [], contains: [] });
                    setShowSuggestions(false);
                }
            }
        }
        catch (error) {
            console.error("Erreur : ", error);
        }
        finally {
            setLoading(false);
        }
    }


    const handleSelect = (meal) => {
        setQuery(meal.strMeal);
        setSearchTerm(meal.strMeal);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    }

    // Combiner les suggestions pour la navigation clavier
    const allSuggestions = [...suggestions.startsWith, ...suggestions.contains];

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={navigateWithKeyboard}
                    onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Rechercher une recette..."
                    className="search-input"
                />
                {loading && <span className="loading-indicator">Chargement...</span>}
            </div>

            {showSuggestions && allSuggestions.length > 0 && (
                <div className="list-group" style={{ position: 'absolute', width: '20%', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                    {suggestions.startsWith.length > 0 && (
                        <>
                            <div className="list-group-item list-group-item-secondary py-2">
                                <small className="fw-bold">
                                    {searchMode === 'area'
                                        ? `Plats ${searchTerm}`
                                        : `Commence par "${searchTerm}"`}
                                </small>
                            </div>
                            {suggestions.startsWith.map((meal, index) => (
                                <Link
                                    to={`/recipe-details/${meal.idMeal}`}
                                    key={meal.idMeal}
                                    className={`list-group-item list-group-item-action d-flex gap-3 py-3 ${index === selectedIndex ? 'active' : ''}`}
                                >
                                    <img
                                        src={meal.strMealThumb}
                                        alt={meal.strMeal}
                                        width="32"
                                        height="32"
                                        className="rounded-circle flex-shrink-0"
                                    />
                                    <div className="d-flex gap-2 w-100 justify-content-between">
                                        <div>
                                            <h6 className="mb-0">{meal.strMeal}</h6>
                                            <p className="mb-0 opacity-75">{meal.strCategory} - {meal.strArea}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}

                    {suggestions.contains.length > 0 && (
                        <>
                            <div className="list-group-item list-group-item-secondary py-2">
                                <small className="fw-bold">Contient "{searchTerm}"</small>
                            </div>
                            {suggestions.contains.map((meal, index) => (
                                <Link
                                    to={`/recipe-details/${meal.idMeal}`}
                                    key={meal.idMeal}
                                    className={`list-group-item list-group-item-action d-flex gap-3 py-3 ${(suggestions.startsWith.length + index) === selectedIndex ? 'active' : ''}`}
                                >
                                    <img
                                        src={meal.strMealThumb}
                                        alt={meal.strMeal}
                                        width="32"
                                        height="32"
                                        className="rounded-circle flex-shrink-0"
                                    />
                                    <div className="d-flex gap-2 w-100 justify-content-between">
                                        <div>
                                            <h6 className="mb-0">{meal.strMeal}</h6>
                                            <p className="mb-0 opacity-75">{meal.strCategory} - {meal.strArea}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}

                </div>
            )}

        </div>
    );

    function SearchAllRelatedFoods() {


    }

}

export default SearchForFood;