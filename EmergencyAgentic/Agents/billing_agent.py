def run_billing_agent(severity_score, ambulance_required):

    if severity_score >= 8:
        base_cost = 50000
    elif severity_score >= 5:
        base_cost = 20000
    else:
        base_cost = 5000

    ambulance_fee = 1500 if ambulance_required else 0
    bed_fee = 2000

    return {
        "base_cost": base_cost,
        "ambulance_fee": ambulance_fee,
        "bed_fee": bed_fee,
        "total_cost": base_cost + ambulance_fee + bed_fee
    }
