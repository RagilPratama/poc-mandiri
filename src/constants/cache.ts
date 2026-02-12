export const CACHE_TTL = {
  DEFAULT: 86400, // 24 hours
  SHORT: 3600,    // 1 hour
  LONG: 604800,   // 7 days
} as const;

export const CACHE_KEYS = {
  PROVINCES: {
    ALL: "provinces:all",
    BY_ID: (id: number) => `province:${id}`,
    SEARCH: (term: string) => `provinces:search:${term.toLowerCase()}`,
  },
  REGENCIES: {
    ALL: "regencies:all",
    BY_ID: (id: number) => `regency:${id}`,
    BY_PROVINCE: (provinceId: number) => `regencies:province:${provinceId}`,
    SEARCH: (term: string) => `regencies:search:${term.toLowerCase()}`,
  },
  DISTRICTS: {
    ALL: "districts:all",
    BY_ID: (id: number) => `district:${id}`,
    BY_REGENCY: (regencyId: number) => `districts:regency:${regencyId}`,
    SEARCH: (term: string) => `districts:search:${term.toLowerCase()}`,
  },
  VILLAGES: {
    ALL: "villages:all",
    BY_ID: (id: number) => `village:${id}`,
    BY_DISTRICT: (districtId: number) => `villages:district:${districtId}`,
    SEARCH: (term: string) => `villages:search:${term.toLowerCase()}`,
  },
} as const;
