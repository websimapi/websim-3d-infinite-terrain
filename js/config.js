export const config = {
    // Terrain configuration
    terrain: {
        chunkSize: 100, // Size of each terrain chunk
        chunkResolution: 128, // Higher resolution for more accurate collisions
        visibleChunks: 3, // Visible chunks in each direction
        maxHeight: 10, // Maximum terrain height
        terrainScale: 100, // Terrain scale factor
        textureTiling: 10, // How many times to repeat the texture
        wireframe: false  // Enable for collision debugging
    },
    
    // Physics configuration
    physics: {
        gravity: -9.82, // Earth gravity
        solverIterations: 20, // Increased for better stability
        defaultMaterial: {
            friction: 0.3, // Lower friction to prevent sticking
            restitution: 0.0 // No bouncing
        }
    },
    
    // Player configuration
    player: {
        height: 1.8,
        radius: 0.5, // Sphere radius for player
        mass: 70,     // Realistic mass
        moveSpeed: 40, // Balanced movement speed
        jumpForce: 200, // Lower jump force
        lookSensitivity: 0.2,
        spawnPosition: { x: 0, y: 50, z: 0 } // Higher spawn position
    }
};