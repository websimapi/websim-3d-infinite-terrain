import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { config } from './config.js';

export function initControls(camera, domElement) {
    const controls = new PointerLockControls(camera, document.body);
    
    // Add event listeners for pointer lock
    domElement.addEventListener('click', () => {
        controls.lock();
    });
    
    // Instructions for the user
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.innerHTML = `
        <div class="instruction-content">
            <h2>Click to play</h2>
            <p>Move: WASD<br>Jump: SPACE<br>Look: MOUSE</p>
        </div>
    `;
    document.body.appendChild(instructions);
    
    // Show/hide instructions based on pointer lock state
    controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
    });
    
    controls.addEventListener('unlock', () => {
        instructions.style.display = 'flex';
    });
    
    return controls;
}