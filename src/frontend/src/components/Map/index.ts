// Map components exports
export { GameMap } from './GameMap';
export { ArenaZone } from './ArenaZone';
export { PlayerIndicator } from './PlayerIndicator';
// Note: RealWorldMap, GameManagerControls, H3Layer, and H3ZoneOverlay are excluded from exports to prevent SSR issues with Leaflet
// Import these components directly where needed using dynamic imports

// Types exports
export type {
  Position,
  ArenaBounds,
  Zone,
  ZoneCoordinates,
  Player,
  PlayerIndicatorData,
  PlayerPosition,
  PrivacyLevel,
  ViewportState,
  MapInteractionHandlers,
  MapConfiguration,
  PrivacyObfuscation,
  GameState,
  Arena,
  GameSession,
  LocationUpdateEvent,
  PlayerStatusEvent,
  ZoneUpdateEvent,
  GameStateEvent,
  GameEvent,
  MapError,
  MapEventHandler,
  MapRef,
  BaseMapProps,
  UseMapOptions,
  UseMapReturn,
  H3Zone,
  H3ZoneGroup,
  ZoneDrawingState,
  Coordinates,
} from './types';

// Constants exports
export {
  PRIVACY_LEVELS,
  ZONE_COLORS,
  PLAYER_COLORS,
  STATUS_COLORS,
} from './types';

// Default export for convenience
export { GameMap as default } from './GameMap';