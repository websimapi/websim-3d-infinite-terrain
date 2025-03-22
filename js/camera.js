import * as THREE from 'three';

export function initCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    // Position camera higher to ensure it's above terrain
    camera.position.set(0, 100, 20); // Increased height and moved back slightly
    camera.lookAt(0, 0, 0);
    
    return camera;
}