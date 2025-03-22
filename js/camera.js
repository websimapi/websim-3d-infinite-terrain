import * as THREE from 'three';

export function initCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    // Set initial position
    camera.position.set(0, 10, 20);
    
    return camera;
}

