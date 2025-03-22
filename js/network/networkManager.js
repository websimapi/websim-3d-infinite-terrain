export class NetworkManager {
    constructor() {
        this.room = null;
        this.isInitialized = false;
        this.connectedPlayers = new Map();
        
        // Reference to other player meshes/entities
        this.playerEntities = new Map();
    }
    
    async initialize() {
        try {
            // Initialize WebsimSocket connection
            this.room = new WebsimSocket();
            await this.room.initialize();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            this.isInitialized = true;
            console.log('Network initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize network:', error);
            return false;
        }
    }
    
    setupEventHandlers() {
        // Subscribe to presence updates (player positions)
        this.room.subscribePresence((presence) => {
            this.handlePresenceUpdate(presence);
        });
        
        // Subscribe to room state updates (game world state)
        this.room.subscribeRoomState((roomState) => {
            this.handleRoomStateUpdate(roomState);
        });
        
        // Handle presence update requests
        this.room.subscribePresenceUpdateRequests((updateRequest, fromClientId) => {
            this.handlePresenceUpdateRequest(updateRequest, fromClientId);
        });
    }
    
    handlePresenceUpdate(presence) {
        // Handle updates to player positions/states
        for (const clientId in presence) {
            if (clientId !== this.room.clientId) {
                // Update other players
                const playerData = presence[clientId];
                if (playerData) {
                    // Process player data (e.g., update positions of other players)
                    this.updateOtherPlayerEntity(clientId, playerData);
                }
            }
        }
    }
    
    handleRoomStateUpdate(roomState) {
        // Handle updates to the game world state
        console.log('Room state updated:', roomState);
        // Implement logic to update game state based on roomState
    }
    
    handlePresenceUpdateRequest(updateRequest, fromClientId) {
        // Handle requests to update this client's presence
        console.log('Presence update request from', fromClientId, updateRequest);
        
        // Example: handle damage request
        if (updateRequest.type === 'damage') {
            // Update local player health and broadcast change
            const currentPresence = this.room.presence[this.room.clientId] || {};
            const newHealth = (currentPresence.health || 100) - updateRequest.amount;
            
            this.updatePresence({
                health: newHealth,
                isDead: newHealth <= 0
            });
        }
    }
    
    updatePresence(data) {
        if (this.isInitialized) {
            this.room.updatePresence(data);
        }
    }
    
    updateRoomState(data) {
        if (this.isInitialized) {
            this.room.updateRoomState(data);
        }
    }
    
    requestPresenceUpdate(clientId, data) {
        if (this.isInitialized) {
            this.room.requestPresenceUpdate(clientId, data);
        }
    }
    
    updateOtherPlayerEntity(clientId, playerData) {
        // This would create or update meshes/entities for other players
        // Implementation depends on how you want to represent other players
        console.log('Updating player entity for', clientId, playerData);
    }
    
    // Methods for working with the database (records)
    async saveWorldObject(object) {
        try {
            return await this.room.collection('worldObjects').create({
                position: { x: object.position.x, y: object.position.y, z: object.position.z },
                rotation: { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
                type: object.type,
                properties: object.properties
            });
        } catch (error) {
            console.error('Failed to save world object:', error);
            return null;
        }
    }
    
    async loadWorldObjects() {
        try {
            return this.room.collection('worldObjects').getList();
        } catch (error) {
            console.error('Failed to load world objects:', error);
            return [];
        }
    }
    
    subscribeToWorldObjects(callback) {
        return this.room.collection('worldObjects').subscribe(callback);
    }
}

