import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    searchMealsByName,
    getMealsByArea,
    findMatchingArea,
    filterSuggestions
} from "../utils/APIMealDB";

function SearchForFood({ onSuggestionsChange }) {



    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState({
        startsWith: [],
        contains: []
    });
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchMode, setSearchMode] = useState('name'); // 'name' ou 'area'
    const [matchedArea, setMatchedArea] = useState(null);






    // Remonter les suggestions et le pays détecté au parent
    useEffect(() => {
        if (onSuggestionsChange) {
            onSuggestionsChange({ suggestions, matchedArea });
        }
    }, [suggestions, matchedArea, onSuggestionsChange]);

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




    const fetchSuggestions = async (term) => {
        setLoading(true);
        try {
            const areaFound = findMatchingArea(term);

            if (areaFound) {
                // Recherche par pays/area
                setSearchMode('area');
                setMatchedArea(areaFound); // Stocker le pays détecté
                const meals = await getMealsByArea(areaFound);
                if (meals.length > 0) {
                    // L'API filter ne renvoie que idMeal, strMeal, strMealThumb
                    // On met tous les résultats dans startsWith pour simplifier
                    setSuggestions({
                        startsWith: meals.map(meal => ({
                            ...meal,
                            strArea: areaFound,
                            strCategory: 'Plat ' + areaFound
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
                setMatchedArea(null); // Pas de pays détecté
                const meals = await searchMealsByName(term);
                if (meals.length > 0) {
                    setSuggestions(filterSuggestions(meals, term));
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
                                            <p className="mb-0 opacity-75">{meal.strCategory}</p>
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



}

export default SearchForFood;