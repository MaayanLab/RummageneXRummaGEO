import React from 'react';

export default function RummageoButton({ genes, description }: { genes?: (string | null)[] | undefined, description?: string | null }) {
    const addToRummageo = async (geneset: string[], description: string) => {
        const url = "https://rummageo.com/graphql";
        const query = {
            operationName: "AddUserGeneSet",
            variables: {
                input: {
                    description: description,
                    genes: geneset
                }
            },
            query: `
                mutation AddUserGeneSet($input: AddUserGeneSetInput!) {
                    addUserGeneSet(input: $input) {
                        userGeneSet {
                            id
                            description
                            __typename
                        }
                        __typename
                    }
                }
            `
        };

        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(query)
            });

            if (response.ok) {
                const res = await response.json();
                const id = res.data.addUserGeneSet.userGeneSet.id;
                window.open(`https://rummageo.com/enrich?dataset=${id}`, "_blank");
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <button
            className="btn btn-sm btn-outline text-xs"
            type="button"
            onClick={() => {
                if (!genes || genes.length === 0) {
                    alert('No genes defined.');
                    return;
                }
                const validGenes = genes.filter((gene): gene is string => gene !== null);
                addToRummageo(validGenes, description || '');
            }}
        >
            Submit to Rummageo
        </button>
    );
}
