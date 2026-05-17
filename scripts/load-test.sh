#!/usr/bin/env bash
# Load test for rate-limit middleware
# Usage: bash scripts/load-test.sh [url] [iterations]

set -e

BASE_URL="${1:-http://localhost:3000}"
ITERATIONS="${2:-30}"
ENDPOINT="$BASE_URL/api/generate"
PASS=0
FAIL=0

echo "=== Load Testing Rate Limit at $ENDPOINT ==="
echo "Iterations: $ITERATIONS"
echo ""

for i in $(seq 1 $ITERATIONS); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 192.168.1.$(( RANDOM % 10 ))" \
    -d '{"prompt":"Test load post for validation purposes","platform":"x"}' 2>/dev/null || echo "000")

  if [ "$STATUS" = "429" ]; then
    echo "[$i] RATE LIMITED (429)"
    FAIL=$((FAIL + 1))
  elif [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo "[$i] OK ($STATUS)"
    PASS=$((PASS + 1))
  elif [ "$STATUS" = "401" ]; then
    echo "[$i] UNAUTHORIZED (401) — expected without session"
    PASS=$((PASS + 1))
  else
    echo "[$i] OTHER ($STATUS)"
    FAIL=$((FAIL + 1))
  fi

  sleep 0.1
done

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Rate limited: $FAIL"
echo "Total: $ITERATIONS"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "⚠️  Rate limiting is active — $FAIL requests were throttled."
else
  echo "✅ No rate limiting triggered. Increase iterations or decrease limits."
fi
