import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/dist/esm/simplex-noise.js';

// Create a single noise generator to be shared across all terrain generation
const noise2D = createNoise2D();

export function generateTerrainNoise(offsetX, offsetZ, resolution, size, maxHeight) {
    const heightData = new Float32Array(resolution * resolution);
    
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            // Calculate world coordinates
            const x = offsetX + (i / (resolution - 1) * size);
            const z = offsetZ + (j / (resolution - 1) * size);
            
            // Use absolute world coordinates for noise sampling to ensure continuity between chunks
            const height = maxHeight * noise2D(x/100, z/100);
            
            // Store the height
            heightData[i + j * resolution] = height;
        }
    }
    
    return heightData;
}