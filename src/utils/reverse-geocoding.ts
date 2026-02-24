import { db } from '../db';
import { mstKabupaten } from '../db/schema';

/**
 * Haversine formula to calculate distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest kabupaten from given coordinates
 */
export async function findNearestKabupaten(
  latitude: number,
  longitude: number
): Promise<{ id: number; name: string; distance: number } | null> {
  try {
    const allKabupaten = await db.select().from(mstKabupaten);

    if (allKabupaten.length === 0) {
      return null;
    }

    // Calculate distance to each kabupaten
    const kabupatensWithDistance = allKabupaten.map((kab) => {
      const kabLat = parseFloat(kab.latitude as any);
      const kabLon = parseFloat(kab.longitude as any);
      const distance = calculateDistance(latitude, longitude, kabLat, kabLon);
      return {
        id: Number(kab.id),
        name: kab.name,
        distance,
      };
    });

    // Sort by distance and get the nearest one
    const nearest = kabupatensWithDistance.sort((a, b) => a.distance - b.distance)[0];

    return nearest || null;
  } catch (error) {
    console.error('Error finding nearest kabupaten:', error);
    return null;
  }
}
