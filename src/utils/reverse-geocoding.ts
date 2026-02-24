import { db } from '../db';
import { mstKabupaten } from '../db/schema';
import { redisClient } from '../redis';

const CACHE_KEY = 'all_kabupaten';
const CACHE_TTL = 86400; // 24 jam

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
 * Get all kabupaten from cache or database
 */
async function getAllKabupatens() {
  try {
    // Try to get from Redis cache
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, fetch from database
    const allKabupaten = await db.select().from(mstKabupaten);

    if (allKabupaten.length > 0) {
      // Cache for 24 hours
      await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(allKabupaten));
    }

    return allKabupaten;
  } catch (error) {
    console.error('Error getting all kabupatens:', error);
    return [];
  }
}

/**
 * Find nearest kabupaten from given coordinates
 */
export async function findNearestKabupaten(
  latitude: number,
  longitude: number
): Promise<{ id: number; name: string; distance: number } | null> {
  try {
    const allKabupaten = await getAllKabupatens();

    if (allKabupaten.length === 0) {
      return null;
    }

    // Calculate distance to each kabupaten
    const kabupatensWithDistance = allKabupaten.map((kab: any) => {
      const kabLat = parseFloat(kab.latitude);
      const kabLon = parseFloat(kab.longitude);
      const distance = calculateDistance(latitude, longitude, kabLat, kabLon);
      return {
        id: Number(kab.id),
        name: kab.name,
        distance,
      };
    });

    // Sort by distance and get the nearest one
    const nearest = kabupatensWithDistance.sort((a: any, b: any) => a.distance - b.distance)[0];

    return nearest || null;
  } catch (error) {
    console.error('Error finding nearest kabupaten:', error);
    return null;
  }
}

/**
 * Clear kabupaten cache (call when data is updated)
 */
export async function clearKabupatensCache() {
  try {
    await redisClient.del(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing kabupaten cache:', error);
  }
}
