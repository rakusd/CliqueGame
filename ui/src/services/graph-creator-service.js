export function createEmptyGraph(verticesNumber, xCenter, yCenter, radius) {
    const fi = verticesNumber % 2 == 0 ? Math.PI / verticesNumber : 0.5 * Math.PI / verticesNumber; 
    return [...Array(verticesNumber).keys()].map((obj, index) => {
        const x = xCenter + radius * Math.cos(fi + 2 * Math.PI * index / verticesNumber);
        const y = yCenter + radius * Math.sin(fi + 2 * Math.PI * index / verticesNumber);
        return {
            group: 'nodes',
            data : {
                id: index
            },
            position: { 
                x,
                y
            } 
        };
    });
}