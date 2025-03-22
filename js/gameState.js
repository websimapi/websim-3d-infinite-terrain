export class GameState {
    constructor() {
        this.players = new Map();
        this.entities = new Map();
        this.worldTime = 0;
        this.gameMode = 'exploration'; // exploration, building, combat
    }
    
    addPlayer(id, data) {
        this.players.set(id, data);
    }
    
    removePlayer(id) {
        this.players.delete(id);
    }
    
    getPlayer(id) {
        return this.players.get(id);
    }
    
    addEntity(id, entity) {
        this.entities.set(id, entity);
    }
    
    removeEntity(id) {
        this.entities.delete(id);
    }
    
    getEntity(id) {
        return this.entities.get(id);
    }
    
    update(deltaTime) {
        this.worldTime += deltaTime;
        
        // Update all entities
        for (const entity of this.entities.values()) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }
    }
}

