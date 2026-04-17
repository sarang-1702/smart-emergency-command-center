def allocate_resource(location, emergency):
    # Simple mock logic (stable and working)

    if location is None or emergency is None:
        return {
            "id": "NA",
            "type": "No Resource",
            "eta": 0,
            "efficiency": 0,
            "path": []
        }

    # Basic mapping
    resource_map = {
        "fire": {"id": "F1", "type": "Fire Truck", "icon": "🚒"},
        "medical": {"id": "A1", "type": "Ambulance", "icon": "🚑"},
        "crime": {"id": "P1", "type": "Police", "icon": "🚔"},
        "accident": {"id": "A1", "type": "Emergency Unit", "icon": "🚨"},
        "natural": {"id": "R1", "type": "Rescue Team", "icon": "🚁"}
    }

    resource = resource_map.get(emergency, {
        "id": "E1",
        "type": "Emergency Unit",
        "icon": "🚨"
    })

    # Fake path (safe)
    path = [1, 8, location] if location != 1 else [1]

    return {
        "id": resource["id"],
        "type": resource["type"],
        "eta": 5,
        "efficiency": 90,
        "path": path
    }