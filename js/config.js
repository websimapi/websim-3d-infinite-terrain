export const config = {
    // Terrain configuration
    terrain: {
        chunkSize: 100, // Size of each terrain chunk
        chunkResolution: 128, // Resolution of each chunk
        visibleChunks: 3, // Visible chunks in each direction (results in a grid of (2*n+1)^2 chunks)
        maxHeight: 10, // Maximum terrain height
        terrainScale: 100, // Terrain scale factor
        textureTiling: 10 // How many times to repeat the texture
    },
    
    // Physics configuration
    physics: {
        gravity: -9.82, // Earth gravity
        solverIterations: 20, // Increased for better stability
        defaultMaterial: {
            friction: 0.5,
            restitution: 0.2
        }
    },
    
    // Player configuration
    player: {
        height: 1.8,
        radius: 0.5,
        mass: 80,
        moveSpeed: 50, // Increased from 10 to make movement more noticeable
        jumpForce: 300,
        lookSensitivity: 0.2,
        spawnPosition: { x: 0, y: 20, z: 0 }
    }
};