import time
import requests

API_KEY = "6FUHIfMXF5ZQ0osEZH80pepM5ath0bKU"
BASE_URL = "https://api.mistral.ai/v1/chat/completions"

def call_mistral(payload, max_retries=5, base_delay=1.0):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    delay = base_delay
    for attempt in range(max_retries):
        resp = requests.post(BASE_URL, json=payload, headers=headers)
        if resp.status_code == 429:
            # Rate limited – backoff then retry
            time.sleep(delay)
            delay *= 2
            continue
        resp.raise_for_status()
        return resp.json()
    raise RuntimeError("Rate limit not recovering after retries")

