import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200; 
    controls.maxPolarAngle = Math.PI / 4; 
    controls.minPolarAngle = 0; 
    
    // Set initial position to top-down
    controls.target.set(0, 0, 0);
    camera.position.set(0, 100, 20); 
    camera.lookAt(0, 0, 0);
    controls.update();
    
    return controls;
}