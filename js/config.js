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
        solverIterations: 10, // Reduced for better performance but still stable
        defaultMaterial: {
            friction: 0.5, // Balanced friction
            restitution: 0.0 // No bouncing
        }
    },
    
    // Player configuration
    player: {
        height: 1.8,
        radius: 0.5, // Larger radius for better collision
        mass: 70,     // Realistic mass
        moveSpeed: 40, // Balanced movement speed
        jumpForce: 200, // Lower jump force
        lookSensitivity: 0.2,
        spawnPosition: { x: 0, y: 50, z: 0 } // Higher spawn position
    }
};