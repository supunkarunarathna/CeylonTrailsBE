/**
 * Scores each ItineraryTemplate against the visitor's "Create Your Own
 * Itinerary" form answers and returns the best 5 matches, ranked highest
 * score first.
 *
 * Scoring weights (out of 100):
 *  - Location preference overlap ......... 40 pts
 *  - Travel mode match .................... 25 pts
 *  - Budget fit ............................ 20 pts
 *  - Group size (headcount) fit ........... 15 pts
 *
 * A template that requires a driving license (i.e. a self-drive car
 * itinerary) is hard-excluded when the visitor does not hold one, since it
 * would not be a usable recommendation.
 */

function scoreLocationOverlap(templateLocations, preferredLocations) {
  if (!preferredLocations || preferredLocations.length === 0) return 20; // no preference stated
  const overlap = templateLocations.filter((loc) => preferredLocations.includes(loc));
  if (overlap.length === 0) return 0;
  return Math.round((overlap.length / preferredLocations.length) * 40);
}

function scoreTravelMode(templateMode, preferredMode) {
  return templateMode === preferredMode ? 25 : 0;
}

function scoreBudget(pricePerPerson, budget) {
  const price = Number(pricePerPerson);
  const b = Number(budget);
  if (!b || b <= 0) return 10;
  if (price <= b) {
    // Reward itineraries that use the budget well (not too far under it)
    const utilization = price / b; // 0..1
    return Math.round(10 + utilization * 10); // 10-20
  }
  // Over budget: scale down penalty, floor at 0
  const overBy = (price - b) / b; // e.g. 0.2 = 20% over
  return Math.max(0, Math.round(20 - overBy * 40));
}

function scoreHeadcount(min, max, totalHeadcount) {
  if (totalHeadcount >= min && totalHeadcount <= max) return 15;
  const distance = totalHeadcount < min ? min - totalHeadcount : totalHeadcount - max;
  return Math.max(0, 15 - distance * 5);
}

/**
 * @param {Array} templates - ItineraryTemplate rows (plain objects)
 * @param {Object} preferences
 * @param {number} preferences.adults
 * @param {number} preferences.children
 * @param {boolean} preferences.hasDrivingLicense
 * @param {string[]} preferences.locationPreferences - subset of ['coastal','hill_country','traditional']
 * @param {string} preferences.travelMode - one of public_transport, tuk_tuk, car, van
 * @param {number} preferences.budget
 * @param {number} [limit=5]
 */
function matchItineraries(templates, preferences, limit = 5) {
  const totalHeadcount = Number(preferences.adults || 0) + Number(preferences.children || 0);

  const scored = templates
    .map((template) => {
      const t = template.toJSON ? template.toJSON() : template;

      if (t.requiresLicense && !preferences.hasDrivingLicense) {
        return { template: t, score: -1, breakdown: null, excluded: true };
      }

      const locationScore = scoreLocationOverlap(t.locationTypes || [], preferences.locationPreferences || []);
      const travelScore = scoreTravelMode(t.travelMode, preferences.travelMode);
      const budgetScore = scoreBudget(t.pricePerPerson, preferences.budget);
      const headcountScore = scoreHeadcount(t.minHeadcount, t.maxHeadcount, totalHeadcount);

      const score = locationScore + travelScore + budgetScore + headcountScore;

      return {
        template: t,
        score,
        excluded: false,
        breakdown: { locationScore, travelScore, budgetScore, headcountScore },
      };
    })
    .filter((entry) => !entry.excluded)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

module.exports = { matchItineraries };
