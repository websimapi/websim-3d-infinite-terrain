import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { config } from '../config.js';

export class Player {
    constructor(scene, physicsSystem, camera, networkManager) {
        this.scene = scene;
        this.physicsSystem = physicsSystem;
        this.camera = camera;
        this.networkManager = networkManager;
        
        this.setupPhysics();
        this.setupControls();
        
        // Initial network update
        this.updateNetworkPosition();
    }
    
    setupPhysics() {
        // Create player physics body (capsule shape)
        const shape = new CANNON.Cylinder(
            config.player.radius,
            config.player.radius,
            config.player.height,
            8
        );
        
        this.body = new CANNON.Body({
            mass: config.player.mass,
            material: this.physicsSystem.defaultMaterial
        });
        this.body.addShape(shape);
        this.body.position.set(
            config.player.spawnPosition.x,
            config.player.spawnPosition.y,
            config.player.spawnPosition.z
        );
        
        // Set fixed rotation
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        
        this.physicsSystem.world.addBody(this.body);
    }
    
    setupControls() {
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
        
        // Setup key listeners
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }
    
    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                this.jump = true;
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'KeyD':
                this.moveRight = false;
                break;
            case 'Space':
                this.jump = false;
                break;
        }
    }
    
    update(deltaTime) {
        // Apply forces based on input
        const velocity = this.body.velocity;
        
        // Calculate move direction from camera view direction
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();
        
        const right = new THREE.Vector3();
        right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
        
        // Reset velocity
        const damping = 0.9;
        velocity.x *= damping;
        velocity.z *= damping;
        
        // Apply movement forces
        const moveSpeed = config.player.moveSpeed;
        
        if (this.moveForward) {
            velocity.x += cameraDirection.x * moveSpeed * deltaTime;
            velocity.z += cameraDirection.z * moveSpeed * deltaTime;
        }
        if (this.moveBackward) {
            velocity.x -= cameraDirection.x * moveSpeed * deltaTime;
            velocity.z -= cameraDirection.z * moveSpeed * deltaTime;
        }
        if (this.moveRight) {
            velocity.x += right.x * moveSpeed * deltaTime;
            velocity.z += right.z * moveSpeed * deltaTime;
        }
        if (this.moveLeft) {
            velocity.x -= right.x * moveSpeed * deltaTime;
            velocity.z -= right.z * moveSpeed * deltaTime;
        }
        
        // Handle jump
        if (this.jump && this.isOnGround()) {
            velocity.y = config.player.jumpForce * deltaTime;
            this.jump = false;
        }
        
        // Update camera position to match player body
        this.camera.position.set(
            this.body.position.x,
            this.body.position.y + config.player.height / 2,
            this.body.position.z
        );
    }
    
    isOnGround() {
        // Simple ground check
        return Math.abs(this.body.velocity.y) < 0.1;
    }
    
    updateNetworkPosition() {
        if (this.networkManager && this.body) {
            this.networkManager.updatePresence({
                position: {
                    x: this.body.position.x,
                    y: this.body.position.y,
                    z: this.body.position.z
                },
                velocity: {
                    x: this.body.velocity.x,
                    y: this.body.velocity.y,
                    z: this.body.velocity.z
                },
                rotation: {
                    x: this.camera.rotation.x,
                    y: this.camera.rotation.y,
                    z: this.camera.rotation.z
                }
            });
        }
    }
}