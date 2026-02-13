# Villages API dengan Full Relations + Pagination

## Endpoint dengan Pagination

Endpoint ini mengembalikan data villages dengan JOIN ke district, regency, dan province - sesuai dengan tampilan di UI yang menampilkan semua level wilayah. Sudah dilengkapi dengan pagination.

### 1. Get All Villages dengan Relations (Paginated)

```
GET /api/master/villages/with-relations?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Nomor halaman, default = 1
- `limit` (optional): Jumlah data per halaman, default = 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "village_id": 123456,
      "village_name": "Lorem Ipsum",
      "district_id": 123,
      "district_name": "Lorem Ipsum",
      "regency_id": 123,
      "regency_name": "Lorem Ipsum",
      "province_id": 32,
      "province_name": "Jawa Barat"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 83437,
    "totalPages": 8344
  }
}
```

**Contoh Request:**
```bash
# Halaman pertama, 10 data
curl "http://localhost:3000/api/master/villages/with-relations?page=1&limit=10"

# Halaman kedua, 20 data
curl "http://localhost:3000/api/master/villages/with-relations?page=2&limit=20"

# Halaman pertama, 50 data
curl "http://localhost:3000/api/master/villages/with-relations?page=1&limit=50"
```

### 2. Search Villages dengan Relations (Paginated)

```
GET /api/master/villages/with-relations/search?q=jakarta&page=1&limit=10
```

**Query Parameters:**
- `q` (optional): Search term untuk nama village
- `page` (optional): Nomor halaman, default = 1
- `limit` (optional): Jumlah data per halaman, default = 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "village_id": 3171010001,
      "village_name": "Gambir",
      "district_id": 317101,
      "district_name": "Gambir",
      "regency_id": 3171,
      "regency_name": "Jakarta Pusat",
      "province_id": 31,
      "province_name": "DKI Jakarta"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 267,
    "totalPages": 27
  }
}
```

**Contoh Request:**
```bash
# Search "jakarta", halaman 1
curl "http://localhost:3000/api/master/villages/with-relations/search?q=jakarta&page=1&limit=10"

# Search "bandung", halaman 2, 20 data per halaman
curl "http://localhost:3000/api/master/villages/with-relations/search?q=bandung&page=2&limit=20"

# Tanpa search (semua data), halaman 1
curl "http://localhost:3000/api/master/villages/with-relations/search?page=1&limit=10"
```

## Response Format

**Mapping ke UI:**
- `village_id` → Kode Wilayah
- `village_name` → Nama Wilayah
- `district_id` → Kode Distrik
- `district_name` → Nama Distrik
- `regency_id` → Kode Kota
- `regency_name` → Nama Kota
- `province_id` → Kode Provinsi
- `province_name` → Nama Provinsi

**Pagination Info:**
- `page`: Halaman saat ini
- `limit`: Jumlah data per halaman
- `total`: Total semua data
- `totalPages`: Total halaman

## Implementasi di Frontend

### Contoh dengan JavaScript/Fetch:

```javascript
async function getVillages(page = 1, limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/master/villages/with-relations?page=${page}&limit=${limit}`
  );
  const result = await response.json();
  
  console.log('Data:', result.data);
  console.log('Current Page:', result.pagination.page);
  console.log('Total Pages:', result.pagination.totalPages);
  console.log('Total Data:', result.pagination.total);
  
  return result;
}

async function searchVillages(searchTerm, page = 1, limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/master/villages/with-relations/search?q=${searchTerm}&page=${page}&limit=${limit}`
  );
  const result = await response.json();
  
  return result;
}

// Usage
getVillages(1, 10); // Get page 1, 10 items
searchVillages('jakarta', 1, 20); // Search jakarta, page 1, 20 items
```

### Contoh dengan React:

```jsx
function VillageTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetch(`/api/master/villages/with-relations?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(result => {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
      });
  }, [page]);

  return (
    <div>
      <table>
        {/* Render data */}
      </table>
      
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Performa

### Dengan Pagination:
- Request: ~30-80ms (query database)
- Dengan cache: ~1-5ms
- Memory efficient: Hanya load data yang diperlukan

### Tanpa Pagination (load semua):
- Request: ~500-2000ms (83,437 rows)
- Memory intensive: Load semua data sekaligus
- Tidak scalable

## Cache Strategy

Setiap kombinasi `page` dan `limit` di-cache terpisah:
- `villages:all:with_relations:page:1:limit:10`
- `villages:all:with_relations:page:2:limit:10`
- `villages:search:jakarta:with_relations:page:1:limit:10`

Cache TTL: 24 jam

## SQL Query yang Dihasilkan

```sql
-- Count total
SELECT COUNT(*) FROM villages;

-- Get paginated data
SELECT 
  v.id AS village_id,
  v.name AS village_name,
  d.id AS district_id,
  d.name AS district_name,
  r.id AS regency_id,
  r.name AS regency_name,
  p.id AS province_id,
  p.name AS province_name
FROM villages v
LEFT JOIN districts d ON v.district_id = d.id
LEFT JOIN regencies r ON d.regency_id = r.id
LEFT JOIN provinces p ON r.province_id = p.id
ORDER BY v.name ASC
LIMIT 10 OFFSET 0;  -- page 1
```

## Testing

```bash
# Start server
bun run dev

# Test pagination
curl "http://localhost:3000/api/master/villages/with-relations?page=1&limit=10"

# Test search with pagination
curl "http://localhost:3000/api/master/villages/with-relations/search?q=jakarta&page=1&limit=20"
```

Atau akses Swagger: `http://localhost:3000/swagger`
