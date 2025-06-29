/**
 * Game State Types for ZK Shroud Arena
 * Comprehensive type definitions for game state management
 */

// Base coordinate system
export interface Coordinates {
  x: number;
  y: number;
}

// Player state interfaces
export interface PlayerLocation extends Coordinates {
  timestamp: number;
  zone: string;
  realWorldCoordinates?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
}

export interface PlayerState {
  id: string;
  location: PlayerLocation;
  health: number;
  maxHealth: number;
  proofStatus: ZKProofStatus;
  isAlive: boolean;
  lastActivity: number;
  team?: string;
  coins: number;
  eliminations: number;
  survivalTime: number;
  score: number;
  gracePeriodEnds?: number;
}

// Arena state interfaces
export interface SafeZone {
  id: string;
  center: Coordinates;
  radius: number;
  isActive: boolean;
  shrinkStartTime?: number;
  shrinkEndTime?: number;
}

export interface ArenaState {
  currentZone: SafeZone;
  nextZone?: SafeZone;
  shrinkTimer: number;
  safeZones: SafeZone[];
  arenaSize: {
    width: number;
    height: number;
  };
  dangerZones: SafeZone[];
  h3Map: string[]; // H3 indices for valid arena zones
  h3Resolution: number; // H3 resolution level
}

// Game phase management
export enum GamePhase {
  LOBBY = 'lobby',
  PREPARATION = 'preparation',
  ACTIVE = 'active',
  ZONE_SHRINKING = 'zone_shrinking',
  SHRINKING = 'shrinking', // Alias for backwards compatibility
  FINAL_ZONE = 'final_zone',
  GAME_OVER = 'game_over',
  ENDED = 'ended' // Alias for backwards compatibility
}

export interface GameTimer {
  totalTime: number;
  remainingTime: number;
  phaseStartTime: number;
  phaseEndTime: number;
  isRunning: boolean;
}

export interface GamePhaseState {
  phase: GamePhase;
  timer: GameTimer;
  playerCount: number;
  maxPlayers: number;
  minPlayers: number;
  roundNumber: number;
}

// ZK Proof state interfaces
export interface ZKProofData {
  proof: string;
  publicInputs: string[];
  timestamp: number;
  location: Coordinates;
  realWorldLocation?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  hash: string;
}

export enum ZKProofStatus {
  NONE = 'none',
  GENERATING = 'generating',
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid',
  EXPIRED = 'expired',
  ERROR = 'error'
}

export interface ZKProofState {
  lastProof?: ZKProofData;
  validationStatus: ZKProofStatus;
  errors: string[];
  proofHistory: ZKProofData[];
  nextProofRequired: number;
  proofCooldown: number;
}

// Real-time updates
export type GameUpdateData = 
  | PlayerLocation
  | SafeZone
  | ZKProofData
  | { playerId: string; reason: string }
  | GamePhase
  | { amount: number; total: number; reason?: string }
  | { message: string; severity: string }
  | unknown; // Allow unknown type for flexibility with WebSocket messages

export interface GameUpdate {
  type: 'player_move' | 'zone_shrink' | 'proof_validation' | 'player_elimination' | 'game_phase' | 'coin_earned' | 'health_changed' | 'warning_issued';
  timestamp: number;
  data: GameUpdateData;
  playerId?: string;
}

export interface RealtimeState {
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  lastUpdate: number;
  updates: GameUpdate[];
  latency: number;
}

// Complete game state
export interface GameState {
  playerState: PlayerState;
  arenaState: ArenaState;
  gamePhase: GamePhaseState;
  zkProofState: ZKProofState;
  realtimeState: RealtimeState;
  gameId: string;
  lastUpdated: number;
  leaderboard?: LeaderboardEntry[];
  warnings?: GameWarning[];
}

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  coins: number;
  eliminations: number;
  score: number;
  isAlive: boolean;
  rank: number;
}

export interface GameWarning {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  expiresAt: number;
}

// State actions for reducers
export enum GameActionType {
  UPDATE_PLAYER_LOCATION = 'UPDATE_PLAYER_LOCATION',
  UPDATE_PLAYER_HEALTH = 'UPDATE_PLAYER_HEALTH',
  UPDATE_PROOF_STATUS = 'UPDATE_PROOF_STATUS',
  UPDATE_ARENA_ZONE = 'UPDATE_ARENA_ZONE',
  UPDATE_GAME_PHASE = 'UPDATE_GAME_PHASE',
  UPDATE_TIMER = 'UPDATE_TIMER',
  ADD_GAME_UPDATE = 'ADD_GAME_UPDATE',
  SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS',
  RESET_GAME_STATE = 'RESET_GAME_STATE',
  HYDRATE_STATE = 'HYDRATE_STATE',
  UPDATE_H3_MAP = 'UPDATE_H3_MAP',
  UPDATE_PLAYER_COINS = 'UPDATE_PLAYER_COINS',
  UPDATE_PLAYER_ELIMINATIONS = 'UPDATE_PLAYER_ELIMINATIONS',
  ADD_WARNING = 'ADD_WARNING',
  REMOVE_WARNING = 'REMOVE_WARNING',
  UPDATE_LEADERBOARD = 'UPDATE_LEADERBOARD'
}

export type GameActionPayload = 
  | PlayerLocation
  | number
  | { status: ZKProofStatus; proof?: ZKProofData; error?: string }
  | { status: 'connected' | 'disconnected' | 'reconnecting'; latency?: number }
  | SafeZone
  | GamePhase
  | GameUpdate
  | string
  | GameStateSnapshot
  | GameState
  | { h3Map: string[]; resolution: number }
  | null;

export interface GameAction {
  type: GameActionType;
  payload: GameActionPayload;
  timestamp?: number;
}

// State persistence
export interface GameStateSnapshot {
  state: GameState;
  timestamp: number;
  version: string;
}

// Context provider props
export interface GameContextProviderProps {
  children: React.ReactNode;
  gameId?: string;
  enablePersistence?: boolean;
  enableRealtime?: boolean;
}

// Hook return types
export interface UseGameStateReturn {
  state: GameState;
  actions: {
    updatePlayerLocation: (location: PlayerLocation) => void;
    updatePlayerHealth: (health: number) => void;
    updateProofStatus: (status: ZKProofStatus, proof?: ZKProofData) => void;
    updateArenaZone: (zone: SafeZone) => void;
    updateGamePhase: (phase: GamePhase) => void;
    resetGame: () => void;
    hydrateState: (snapshot: GameStateSnapshot) => void;
  };
  utils: {
    isPlayerInSafeZone: (playerId?: string) => boolean;
    getDistanceToZoneCenter: (playerId?: string) => number;
    getTimeUntilNextShrink: () => number;
    canGenerateProof: (playerId?: string) => boolean;
    saveStateSnapshot: () => GameStateSnapshot;
    loadStateSnapshot: (snapshot: GameStateSnapshot) => void;
  };
}

// Configuration types
export interface GameConfig {
  arenaSize: { width: number; height: number };
  maxPlayers: number;
  minPlayers: number;
  phaseDurations: Record<GamePhase, number>;
  proofCooldown: number;
  zoneShringRate: number;
  playerStartHealth: number;
}

// Error types
export interface GameError {
  code: string;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

// Event types for game events
export interface GameEvent {
  type: string;
  data: GameUpdateData;
  timestamp: number;
  playerId?: string;
}