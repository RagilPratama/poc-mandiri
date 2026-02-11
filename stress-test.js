import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1000,        // 👈 1000 user bersamaan
  duration: "1m",   // 👈 jalan selama 1 menit
};

export default function () {
  const res = http.get("http://localhost:3000/api/features");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 600ms": (r) => r.timings.duration < 600,
  });

  sleep(1);
}