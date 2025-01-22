'use server'

export default async function getEnrichrTerms(userListId: string, enrichrLibraries: string[]) {
    const ENRICHR_URL = 'https://maayanlab.cloud/Enrichr/'

    const enrichrStats: Record<string, string[]> = {}
    for (let i = 0; i < enrichrLibraries.length; i++) {
        const enrichrLibrary = enrichrLibraries[i]
        const query_string = `enrich?userListId=${userListId}&backgroundType=${enrichrLibrary}`
        const response = await fetch(ENRICHR_URL + query_string, {
            method: 'GET', 
            headers: {'Accept': 'application/json'}
        })
        if (!response.ok) {
            throw new Error('Error fetching enrichment results');
        }
        const data = await response.json();
        for (let j = 0; j < Math.min(data[enrichrLibrary].length, 3); j++) {
            enrichrStats[data[enrichrLibrary][j][1]] = data[enrichrLibrary][j]
            enrichrStats[data[enrichrLibrary][j][1]].push(enrichrLibrary)

        }
        await new Promise<void>((resolve, reject) => {setTimeout(() => {resolve()}, 500)})
    }

    return  enrichrStats
}
