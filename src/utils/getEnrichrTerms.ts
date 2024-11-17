// 'use server'
// import axios from 'axios';


// export default async function getEnrichrTerms(genes: string[], enrichrLibraries: string[]) {
//     const ENRICHR_URL = 'https://maayanlab.cloud/Enrichr/'
//     const endpoint = 'addList'
//     var userListId
//     try {

//         const genesString = genes.join('\n').replaceAll("'", '')
//         const { data } = await axios.post(ENRICHR_URL + endpoint, {
//             'list': genesString,
//             'description': ''
//         }, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         }
//         )
//         userListId = data.userListId;
//     } catch (error) {
//         console.error(error);
//         return;
//     }

//     const enrichedTerms: Record<string, string[]> = {}
//     const enrichrStats: Record<string, string[]> = {}
//     for (let i = 0; i < enrichrLibraries.length; i++) {
//         const enrichrLibrary = enrichrLibraries[i]
//         const query_string = `enrich?userListId=${userListId}&backgroundType=${enrichrLibrary}`
//         const response = await fetch(ENRICHR_URL + query_string, {
//             method: 'GET', 
//             headers: {'Accept': 'application/json'}
//         })
//         if (!response.ok) {
//             throw new Error('Error fetching enrichment results');
//         }
//         const data = await response.json();
//         enrichedTerms[enrichrLibrary] = []
//         for (let j = 0; j < Math.min(data[enrichrLibrary].length, 3); j++) {
//             enrichedTerms[enrichrLibrary].push(data[enrichrLibrary][j][1])
//             enrichrStats[data[enrichrLibrary][j][1]] = data[enrichrLibrary][j]
//             enrichrStats[data[enrichrLibrary][j][1]].push(enrichrLibrary)

//         }
//         await new Promise<void>((resolve, reject) => {setTimeout(() => {resolve()}, 500)})
//     }

//     return [enrichedTerms, enrichrStats]
// }

'use server'
import axios from 'axios';

export default async function getEnrichrTerms(genes: string[], enrichrLibraries: string[]) {
    const ENRICHR_URL = 'https://maayanlab.cloud/Enrichr/';
    const endpoint = 'addList';
    let userListId;
    
    // Helper to log errors
    const logError = (message: string, error: any) => {
        console.error(`${message}:`, error);
    };

    try {
        const genesString = genes.join('\n').replaceAll("'", '');
        const { data } = await axios.post(ENRICHR_URL + endpoint, {
            'list': genesString,
            'description': ''
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        userListId = data.userListId;
        console.log(`Successfully posted genes. UserListId: ${userListId}`);
    } catch (error) {
        logError('Error posting gene list', error);
        return;
    }

    const enrichedTerms: Record<string, string[]> = {};
    const enrichrStats: Record<string, string[]> = {};

    // Function to perform a fetch request with a timeout
    const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 5000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    logError('Fetch request timed out', error);
                } else {
                    logError('Fetch error', error);
                }
            } else {
                logError('Unknown error', error);
            }
            throw error; // Re-throw to handle retries
        }
    };

    // Retry logic for fetch requests
    const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await fetchWithTimeout(url, options);
            } catch (error) {
                console.log(`Attempt ${attempt} failed. Retrying...`);
                if (attempt === retries) {
                    throw new Error('Max retries reached. Fetch failed.');
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between retries
        }
    };

    for (let i = 0; i < enrichrLibraries.length; i++) {
        const enrichrLibrary = enrichrLibraries[i];
        const query_string = `enrich?userListId=${userListId}&backgroundType=${enrichrLibrary}`;
        
        let response;
        try {
            response = await fetchWithRetry(ENRICHR_URL + query_string, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
        } catch (error) {
            logError(`Failed to fetch enrichment results for ${enrichrLibrary}`, error);
            continue; // Skip to the next library if this one fails
        }

        // Check if the response is defined and OK
        if (response && !response.ok) {
            logError(`Error fetching enrichment results for ${enrichrLibrary}`, new Error(`Response status: ${response.status}`));
            continue; // Skip to the next library
        }

        // Ensure response is defined before parsing
        if (response) {
            const data = await response.json();
            console.log(`Successfully fetched data for ${enrichrLibrary}`);

            enrichedTerms[enrichrLibrary] = [];
            for (let j = 0; j < Math.min(data[enrichrLibrary].length, 3); j++) {
                enrichedTerms[enrichrLibrary].push(data[enrichrLibrary][j][1]);
                enrichrStats[data[enrichrLibrary][j][1]] = data[enrichrLibrary][j];
                enrichrStats[data[enrichrLibrary][j][1]].push(enrichrLibrary);
            }

            // Delay between requests to avoid overloading the API
            await new Promise<void>((resolve) => setTimeout(resolve, 500));
        }
    }

    return [enrichedTerms, enrichrStats];
}
