export type LandingImpact = {
  foodRescuedKg: number;
  mealsRedistributed: number;
  successfulDeliveries: number;
  ngosInvolved: number;
  activeVolunteers: number;
};

export const demoLandingImpact: LandingImpact = {
  foodRescuedKg: 1280,
  mealsRedistributed: 3840,
  successfulDeliveries: 426,
  ngosInvolved: 18,
  activeVolunteers: 74,
};

export const formatImpactNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);

const firstNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  return fallback;
};

export const normalizeLandingImpact = (payload: unknown): LandingImpact | null => {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const source =
    record.impact && typeof record.impact === "object"
      ? (record.impact as Record<string, unknown>)
      : record.stats && typeof record.stats === "object"
        ? (record.stats as Record<string, unknown>)
        : record;

  const hasRealValues = [
    source.foodRescuedKg,
    source.foodSaved,
    source.totalFoodSaved,
    source.mealsRedistributed,
    source.meals,
    source.successfulDeliveries,
    source.deliveries,
    source.totalDonations,
    source.ngosInvolved,
    source.ngos,
    source.activeVolunteers,
    source.volunteers,
  ].some((value) => typeof value === "number" && Number.isFinite(value));

  if (!hasRealValues) return null;

  return {
    foodRescuedKg: firstNumber(
      source.foodRescuedKg ?? source.foodSaved ?? source.totalFoodSaved,
      demoLandingImpact.foodRescuedKg,
    ),
    mealsRedistributed: firstNumber(source.mealsRedistributed ?? source.meals, demoLandingImpact.mealsRedistributed),
    successfulDeliveries: firstNumber(
      source.successfulDeliveries ?? source.deliveries ?? source.totalDonations,
      demoLandingImpact.successfulDeliveries,
    ),
    ngosInvolved: firstNumber(source.ngosInvolved ?? source.ngos, demoLandingImpact.ngosInvolved),
    activeVolunteers: firstNumber(source.activeVolunteers ?? source.volunteers, demoLandingImpact.activeVolunteers),
  };
};
