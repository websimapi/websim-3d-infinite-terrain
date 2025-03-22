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
let isInitialized = false;

// Initialize the game
async function init() {
    try {
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
        
        // Set up controls after player is created
        controls = initControls(camera, renderer.domElement);
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        isInitialized = true;
        
        // Start the render loop
        animate();
        
        // Start updating player position to network
        setInterval(() => {
            if (player) {
                player.updateNetworkPosition();
            }
        }, 100); // Update position every 100ms
        
        console.log("Game initialized successfully!");
    } catch (error) {
        console.error("Error initializing game:", error);
    }
}

// Clock for delta time calculation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    if (!isInitialized) return;
    
    const delta = Math.min(0.1, clock.getDelta());
    
    // Update systems
    if (physicsSystem) physicsSystem.update(delta);
    if (terrainSystem) terrainSystem.update(camera.position);
    if (player) {
        player.update(delta);
        
        // Update debug info
        if (player.body) {
            document.getElementById('player-pos').textContent = 
                `Position: X:${player.body.position.x.toFixed(2)} Y:${player.body.position.y.toFixed(2)} Z:${player.body.position.z.toFixed(2)}`;
            document.getElementById('player-vel').textContent = 
                `Velocity: X:${player.body.velocity.x.toFixed(2)} Y:${player.body.velocity.y.toFixed(2)} Z:${player.body.velocity.z.toFixed(2)}`;
        }
    }
    
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