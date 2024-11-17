"use client"
import React, { useEffect, useState } from 'react';
import Loading
 from '@/components/loading2';

 
const YourComponent = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string | null>(null); // Adjust the type based on your expected data
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error before fetching

            try {
                const response = await fetch('/api/your-endpoint?species=yourSpecies&q=yourQuery');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.text(); // Adjust this according to your response type
                setData(result); // Set the data received from the API
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading && <Loading />} {/* Use your pre-made loading component */}
            {error && <div className="error">{error}</div>}
            {data && <div className="data">{data}</div>}
        </div>
    );
};

export default YourComponent;
