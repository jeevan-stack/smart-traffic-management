import urllib.request
import json

# GET /api/junctions
r = urllib.request.urlopen("http://localhost:8000/api/junctions")
junctions = json.loads(r.read())
print(f"[3] GET /api/junctions -> HTTP 200 | Count: {len(junctions)}")
for j in junctions:
    print(f"    {j['junction_id']} : {j['junction_name']} | {j['sector']} | capacity={j['capacity']}")
