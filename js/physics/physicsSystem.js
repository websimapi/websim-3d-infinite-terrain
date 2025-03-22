import * as CANNON from 'cannon-es';
import { config } from '../config.js';

export class PhysicsSystem {
    constructor() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, config.physics.gravity, 0)
        });
        
        this.world.solver.iterations = config.physics.solverIterations;
        
        // Default materials
        this.defaultMaterial = new CANNON.Material('default');
        const defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: config.physics.defaultMaterial.friction,
                restitution: config.physics.defaultMaterial.restitution
            }
        );
        this.world.addContactMaterial(defaultContactMaterial);
    }
    
    update(deltaTime) {
        this.world.step(deltaTime);
    }
    
    addTerrain(geometry, position) {
        // Create a heightfield from geometry
        const vertices = geometry.attributes.position.array;
        const resolution = Math.sqrt(vertices.length / 3);
        
        // Extract heightfield data
        const heights = [];
        const elementSize = geometry.parameters.width / (resolution - 1);
        
        for (let i = 0; i < resolution; i++) {
            heights[i] = [];
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 3 + 1; // +1 for y component
                heights[i][j] = vertices[index];
            }
        }
        
        const terrainShape = new CANNON.Heightfield(heights, {
            elementSize: elementSize
        });
        
        const terrainBody = new CANNON.Body({
            mass: 0, // Static body
            material: this.defaultMaterial,
            shape: terrainShape,
            collisionFilterGroup: 1, // Terrain group
            collisionFilterMask: 1   // Collide with group 1 (which includes player)
        });
        
        // Position the body correctly - adjusted for better collision
        terrainBody.position.set(
            position.x - elementSize * (resolution - 1) / 2,
            position.y,
            position.z - elementSize * (resolution - 1) / 2
        );
        terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        
        this.world.addBody(terrainBody);
        
        return terrainBody;
    }
    
    createRigidBody(mesh, mass, shape) {
        const body = new CANNON.Body({
            mass: mass,
            material: this.defaultMaterial
        });
        
        if (shape) {
            body.addShape(shape);
        } else {
            // Auto-generate shape based on mesh
            if (mesh.geometry.type === 'BoxGeometry') {
                const halfExtents = new CANNON.Vec3(
                    mesh.geometry.parameters.width / 2,
                    mesh.geometry.parameters.height / 2,
                    mesh.geometry.parameters.depth / 2
                );
                body.addShape(new CANNON.Box(halfExtents));
            } else if (mesh.geometry.type === 'SphereGeometry') {
                body.addShape(new CANNON.Sphere(mesh.geometry.parameters.radius));
            }
            // Add more shape types as needed
        }
        
        body.position.copy(mesh.position);
        body.quaternion.copy(mesh.quaternion);
        
        this.world.addBody(body);
        
        return body;
    }
    
    removeBody(body) {
        this.world.removeBody(body);
    }
}