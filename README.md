# 3D Infinite Terrain Game

## Assets and Textures

The game references the texture assets through the directory structure revealed in the available assets section. The main texture used is the grass texture located at `./assets/textures/grass.jpg`, which is loaded in the TerrainSystem's `createMaterials` method:

```javascript
createMaterials() {
    const groundTexture = new THREE.TextureLoader().load('./assets/textures/grass.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(this.config.textureTiling, this.config.textureTiling);
    
    return {
        ground: new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.8,
            metalness: 0.2,
            wireframe: this.config.wireframe
        })
    };
}

