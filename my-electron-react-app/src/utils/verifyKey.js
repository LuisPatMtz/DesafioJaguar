import teamKeys from '../data/teamKeys.json';

export function verifyKey(teamId, keyName, passwordInput) {
  const team = teamKeys[teamId];
  if (!team) return false;
  return team[keyName] === passwordInput;
}
