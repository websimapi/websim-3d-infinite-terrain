import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js';

const simplex = new SimplexNoise();

export function generateTerrainNoise(offsetX, offsetZ, resolution, size, maxHeight) {
    const heightData = new Float32Array(resolution * resolution);
    
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x = offsetX + (i / (resolution - 1) * size);
            const z = offsetZ + (j / (resolution - 1) * size);
            
            // For now, flat terrain with slight noise
            const height = 0; // Flat terrain base
            
            // Store the height
            heightData[i + j * resolution] = height;
        }
    }
    
    return heightData;
}

