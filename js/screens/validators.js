export function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function requiredNumber(value) {
  return isNumber(value);
}

export function clamp(value, min, max) {
  if (!isNumber(value)) return null;
  return Math.min(max, Math.max(min, value));
}
export function validateTask2Filters(raw) {
  const errors = {};

  let maxDistanceKm = Number(raw.maxDistanceKm);
  let minRating = Number(raw.minRating);
  let maxVisitFee = Number(raw.maxVisitFee);

  if (!requiredNumber(maxDistanceKm)) errors.dist = "Max distance is required.";
  if (!requiredNumber(minRating)) errors.rating = "Min rating is required.";
  if (!requiredNumber(maxVisitFee)) errors.fee = "Max visit fee is required.";

  if (!errors.dist) {
    if (maxDistanceKm < 1 || maxDistanceKm > 50) errors.dist = "Max distance must be between 1 and 50 km.";
  }

  if (!errors.rating) {
    if (minRating < 1 || minRating > 5) errors.rating = "Min rating must be between 1.0 and 5.0.";
  }

  if (!errors.fee) {
    if (maxVisitFee < 0 || maxVisitFee > 1000) errors.fee = "Max visit fee must be between 0 and 1000 RON.";
  }

  const ok = Object.keys(errors).length === 0;

  if (ok) {
    maxDistanceKm = clamp(maxDistanceKm, 1, 50);
    minRating = clamp(minRating, 1, 5);
    minRating = Math.round(minRating * 10) / 10;
    maxVisitFee = clamp(maxVisitFee, 0, 1000);
  }

  return {
    ok,
    errors,
    values: { maxDistanceKm, minRating, maxVisitFee }
  };
}
