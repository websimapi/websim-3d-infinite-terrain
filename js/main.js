import * as THREE from 'three';
import { initRenderer } from './renderer.js';
import { initScene } from './scene.js';
import { initCamera } from './camera.js';
import { initControls } from './controls.js';
import { TerrainSystem } from './terrain/terrainSystem.js';
import { PhysicsSystem } from './physics/physicsSystem.js';
import { Player } from './entities/player.js';
import { NetworkManager } from './network/networkManager.js';
import { config } from './config.js';
import { GameState } from './gameState.js';

// Global objects
let stats, renderer, scene, camera, controls;
let terrainSystem, physicsSystem, player, networkManager;
let gameState;

// Initialize the game
async function init() {
    // Core three.js setup
    renderer = initRenderer();
    scene = initScene();
    camera = initCamera();
    
    // Initialize stats for performance monitoring
    stats = new Stats();
    document.body.appendChild(stats.dom);
    
    // Game state management
    gameState = new GameState();
    
    // Initialize systems
    physicsSystem = new PhysicsSystem();
    terrainSystem = new TerrainSystem(scene, physicsSystem, config.terrain);
    
    // Initialize networking
    networkManager = new NetworkManager();
    await networkManager.initialize();
    
    // Initialize player
    player = new Player(scene, physicsSystem, camera, networkManager);
    
    // Set up controls after player is created (not before)
    controls = initControls(camera, renderer.domElement);
    
    // Hide loading screen
    document.getElementById('loading').style.display = 'none';
    
    // Start the render loop
    animate();
    
    // Start updating player position to network
    setInterval(() => {
        if (player) {
            player.updateNetworkPosition();
        }
    }, 100); // Update position every 100ms
}

// Clock for delta time calculation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = Math.min(0.1, clock.getDelta());
    
    // Update systems
    if (physicsSystem) physicsSystem.update(delta);
    if (terrainSystem) terrainSystem.update(camera.position);
    if (player) player.update(delta);
    if (controls) controls.update();
    
    // Actually render the scene
    renderer.render(scene, camera);
    stats.update();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', init);