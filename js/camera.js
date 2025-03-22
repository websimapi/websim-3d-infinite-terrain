import * as THREE from 'three';

export function initCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    // Set initial position higher to see the terrain
    camera.position.set(0, 30, 30);
    
    return camera;
}