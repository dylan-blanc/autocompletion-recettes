import { useState, useEffect } from "react";

function SearchForFood() {

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

    
    const filterSuggestions = (meals, query) => {
        const lowerQuery = query.toLowerCase();
        const startWith = meals.filter(meal => meal.strMeal.toLowerCase().startWith(lowerQuery).slice(0, 5));
        const contains = meals.filter(meal => {
            const name = meal.strMeal.toLowerCase();
            return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
        }).slice(0, 5);

        return { ...startWith, ...contains };
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
}