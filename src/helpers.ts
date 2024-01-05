export const TABLE_GAME_ROOMS = "gameRooms";
export const TABLE_HISTORY = "gameHistory";

export const playSound = () => {
  const context = new AudioContext();
  const o = context.createOscillator();
  const g = context.createGain();

  o.connect(g);
  o.type = "sine";
  g.connect(context.destination);
  o.start(0);

  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
};
