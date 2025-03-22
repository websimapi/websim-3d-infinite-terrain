import * as THREE from 'three';

export class TerrainChunk {
    constructor(x, z, size, resolution, heightData, material, physicsSystem) {
        this.x = x;
        this.z = z;
        this.size = size;
        this.resolution = resolution;
        
        // Create mesh
        this.geometry = this.createGeometry(heightData);
        this.mesh = new THREE.Mesh(this.geometry, material);
        
        // Set position to exact world coordinates
        this.mesh.position.set(x * size, 0, z * size);
        this.mesh.receiveShadow = true;
        
        // Add physics body
        this.physicsBody = physicsSystem.addTerrain(this.geometry, this.mesh.position);
    }
    
    createGeometry(heightData) {
        const geometry = new THREE.PlaneGeometry(
            this.size, 
            this.size, 
            this.resolution - 1, 
            this.resolution - 1
        );
        
        geometry.rotateX(-Math.PI / 2); // Rotate to be horizontal
        
        const vertices = geometry.attributes.position.array;
        
        // Set heights from height data
        for (let i = 0; i < vertices.length; i += 3) {
            const index = Math.floor(i / 3);
            vertices[i + 1] = heightData[index]; // Y is up in Three.js
        }
        
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
        
        return geometry;
    }
    
    dispose() {
        this.geometry.dispose();
        if (this.physicsBody) {
            // Remove from physics world
            this.physicsBody.world.removeBody(this.physicsBody);
        }
    }
}