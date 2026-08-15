#!/usr/bin/env bash
# Post-deploy verification script
# Usage: bash scripts/post-deploy-verify.sh <domain>
set -eo pipefail

DOMAIN="${1:-https://ai.teosegypt.com}"
PASS=0
FAIL=0

check() {
  local label="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label — expected $expected, got $actual"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Post-Deploy Verification: $DOMAIN ==="
echo ""
echo "--- Security Headers ---"

HDRS=$(curl -sI "$DOMAIN/login" 2>/dev/null)

check "CSP present" "1" "$(echo "$HDRS" | grep -ci "^content-security-policy:" || true)"
check "HSTS present" "1" "$(echo "$HDRS" | grep -ci "^strict-transport-security:" || true)"
check "X-Frame-Options DENY" "1" "$(echo "$HDRS" | grep -ci "x-frame-options: deny" || true)"
check "X-Content-Type-Options nosniff" "1" "$(echo "$HDRS" | grep -ci "x-content-type-options: nosniff" || true)"
check "X-Request-ID present" "1" "$(echo "$HDRS" | grep -ci "^x-request-id:" || true)"
check "Permissions-Policy present" "1" "$(echo "$HDRS" | grep -ci "^permissions-policy:" || true)"

echo ""
echo "--- Route Behavior ---"

check "Login /login → 200" "200" "$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/login" 2>/dev/null)"
check "Health /api/health → 200" "200" "$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/api/health" 2>/dev/null)"
check "Generate (no auth) → 307|401" "1" "$(curl -s -o /dev/null -w '%{http_code}' -X POST "$DOMAIN/api/generate" -H 'Content-Type: application/json' -d '{}' 2>/dev/null | grep -cE '307|401' || true)"

echo ""
echo "--- Correlation ID ---"
check "X-Request-ID on /api/health" "1" "$(curl -sI "$DOMAIN/api/health" 2>/dev/null | grep -ci "^x-request-id:" || true)"

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "⚠️  Some checks failed — review above."
else
  echo "✅ All checks passed!"
fi
