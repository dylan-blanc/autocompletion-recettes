import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les appels API
 * @param {Function} fetchFunction - Fonction async à exécuter
 * @param {Array} dependencies - Dépendances pour le useEffect
 * @param {boolean} immediate - Exécuter immédiatement (default: true)
 * @returns {{ data: any, loading: boolean, error: Error|null, refetch: Function }}
 */
function useFetch(fetchFunction, dependencies = [], immediate = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err);
            console.error('Erreur useFetch:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, loading, error, refetch: execute };
}

export default useFetch;
