export const LIFE_EXPECTANCY = 85
export const HEALTHY_LIFE_EXPECTANCY = 72

export function calculateRemainingCount(
  currentAge: number,
  targetAge: number,
  annualFrequency: number,
): number {
  const remainingYears = targetAge - currentAge
  if (remainingYears <= 0) return 0
  return Math.floor(remainingYears * annualFrequency)
}

export function getDefaultUntilAge(
  relationship: string,
  personAge: number,
  userAge: number,
): number {
  switch (relationship) {
    case "child":
      return personAge + 18 // 成人まで
    case "parent":
      return Math.min(personAge + (LIFE_EXPECTANCY - personAge), LIFE_EXPECTANCY)
    case "partner":
      return userAge + (HEALTHY_LIFE_EXPECTANCY - userAge)
    default:
      return Math.min(personAge + 30, HEALTHY_LIFE_EXPECTANCY)
  }
}
