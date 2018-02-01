export function getTalentLevelByTier(tier: number) {
  return tier === 7 ? 100 : tier * 15;
}
