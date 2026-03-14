#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "[smoke] Base URL: $BASE_URL"

check_status() {
  local path="$1"
  local expected_csv="$2"
  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")"

  IFS=',' read -r -a expected_codes <<< "$expected_csv"
  local matched="false"
  for expected in "${expected_codes[@]}"; do
    if [[ "$code" == "$expected" ]]; then
      matched="true"
      break
    fi
  done

  if [[ "$matched" != "true" ]]; then
    echo "[smoke] FAIL status $path expected one of=[$expected_csv] got=$code"
    exit 1
  fi
  echo "[smoke] OK status $path -> $code"
}

check_content_type_any_prefix() {
  local path="$1"
  local expected_prefix_csv="$2"
  local content_type
  content_type="$(curl -sI "$BASE_URL$path" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print $2}' | head -n1)"

  IFS=',' read -r -a expected_prefixes <<< "$expected_prefix_csv"
  local lowered_content="${content_type,,}"
  local matched="false"
  for prefix in "${expected_prefixes[@]}"; do
    local lowered_prefix="${prefix,,}"
    if [[ "$lowered_content" == "$lowered_prefix"* ]]; then
      matched="true"
      break
    fi
  done

  if [[ "$matched" != "true" ]]; then
    echo "[smoke] FAIL content-type $path expected one of prefixes=[$expected_prefix_csv] got=${content_type:-<empty>}"
    exit 1
  fi
  echo "[smoke] OK content-type $path -> $content_type"
}

check_header_present() {
  local path="$1"
  local header_name="$2"
  local header_val
  header_val="$(curl -sI "$BASE_URL$path" | tr -d '\r' | awk -F': ' -v name="$header_name" 'tolower($1)==tolower(name){print $2}' | head -n1)"
  if [[ -z "$header_val" ]]; then
    echo "[smoke] FAIL missing header $header_name on $path"
    exit 1
  fi
  echo "[smoke] OK header $header_name on $path -> $header_val"
}

check_status "/" "200"
check_status "/portal.html" "200,401"
check_status "/api/health" "200"

check_content_type_any_prefix "/dist/app.js" "application/javascript,text/javascript"
check_content_type_any_prefix "/dist/components/Header.js" "application/javascript,text/javascript"
check_content_type_any_prefix "/dist/tailwind.css" "text/css"

check_header_present "/" "X-Content-Type-Options"
check_header_present "/" "Content-Security-Policy"
check_header_present "/" "X-Frame-Options"

echo "[smoke] All checks passed."
