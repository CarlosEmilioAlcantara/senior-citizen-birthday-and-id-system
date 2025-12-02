def create_address(
    house,
    street,
    barangay,
    city,
    province,
    subdivision=None
):
    address = f"{house}, {street}, {subdivision and barangay or barangay}, {city}, {province}"
    return address