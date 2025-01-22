import React from 'react';

export default function RummageneButton({ genes, description }: { genes?: (string | null)[] | undefined, description?: string | null }) {
    const addToRummagene = async (geneset: string[], description: string) => {
        const url = "https://rummagene.com/graphql";
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
                window.open(`https://rummagene.com/enrich?dataset=${id}`, "_blank");
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
                addToRummagene(validGenes, description || '');
            }}
        >
            Submit to Rummagene
        </button>
    );
}
