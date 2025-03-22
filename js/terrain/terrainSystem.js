import * as THREE from 'three';
import { TerrainChunk } from './terrainChunk.js';
import { generateTerrainNoise } from './terrainGenerator.js';

export class TerrainSystem {
    constructor(scene, physicsSystem, config) {
        this.scene = scene;
        this.physicsSystem = physicsSystem;
        this.config = config;
        
        this.chunks = new Map(); // Map of loaded chunks (key is chunkId)
        this.materials = this.createMaterials();
        
        // Load initial chunks
        this.updateChunks({ x: 0, y: 0, z: 0 });
    }
    
    createMaterials() {
        const groundTexture = new THREE.TextureLoader().load('./assets/textures/grass.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(this.config.textureTiling, this.config.textureTiling);
        
        return {
            ground: new THREE.MeshStandardMaterial({ 
                map: groundTexture,
                roughness: 0.8,
                metalness: 0.2,
                wireframe: this.config.wireframe // Add wireframe option for debugging
            })
        };
    }
    
    getChunkId(x, z) {
        return `${Math.floor(x / this.config.chunkSize)},${Math.floor(z / this.config.chunkSize)}`;
    }
    
    update(cameraPosition) {
        this.updateChunks(cameraPosition);
    }
    
    updateChunks(position) {
        const centerChunkX = Math.floor(position.x / this.config.chunkSize);
        const centerChunkZ = Math.floor(position.z / this.config.chunkSize);
        
        const visibleChunks = this.config.visibleChunks;
        const chunksToKeep = new Set();
        
        // Generate or update chunks
        for (let x = centerChunkX - visibleChunks; x <= centerChunkX + visibleChunks; x++) {
            for (let z = centerChunkZ - visibleChunks; z <= centerChunkZ + visibleChunks; z++) {
                const chunkId = `${x},${z}`;
                chunksToKeep.add(chunkId);
                
                // Create new chunk if it doesn't exist
                if (!this.chunks.has(chunkId)) {
                    // Calculate exact world coordinates for the chunk
                    const worldX = x * this.config.chunkSize;
                    const worldZ = z * this.config.chunkSize;
                    
                    // Generate terrain data at exact world coordinates to ensure continuity
                    const heightData = generateTerrainNoise(
                        worldX,
                        worldZ,
                        this.config.chunkResolution,
                        this.config.chunkSize,
                        this.config.maxHeight
                    );
                    
                    const chunk = new TerrainChunk(
                        x, z,
                        this.config.chunkSize,
                        this.config.chunkResolution,
                        heightData,
                        this.materials.ground,
                        this.physicsSystem
                    );
                    
                    this.chunks.set(chunkId, chunk);
                    this.scene.add(chunk.mesh);
                }
            }
        }
        
        // Remove chunks that are too far
        for (const [chunkId, chunk] of this.chunks.entries()) {
            if (!chunksToKeep.has(chunkId)) {
                this.scene.remove(chunk.mesh);
                chunk.dispose();
                this.chunks.delete(chunkId);
            }
        }
    }
}