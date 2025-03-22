import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/dist/esm/simplex-noise.js';

const noise2D = createNoise2D();

export function generateTerrainNoise(offsetX, offsetZ, resolution, size, maxHeight) {
    const heightData = new Float32Array(resolution * resolution);
    
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x = offsetX + (i / (resolution - 1) * size);
            const z = offsetZ + (j / (resolution - 1) * size);
            
            // Increase terrain visibility by adding more variation
            const height = maxHeight * 0.5 * noise2D(x/100, z/100); // More noticeable terrain variation
            
            // Store the height
            heightData[i + j * resolution] = height;
        }
    }
    
    return heightData;
}