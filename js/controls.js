import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 4; // Limit rotation to maintain top-down view
    controls.minPolarAngle = 0; // Allow rotation to overhead view
    
    // Set initial position to top-down
    controls.target.set(0, 0, 0);
    camera.position.set(0, 50, 0);
    camera.lookAt(0, 0, 0);
    controls.update();
    
    return controls;
}