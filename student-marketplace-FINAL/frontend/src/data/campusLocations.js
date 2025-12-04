// Saskatchewan Polytechnic Regina Campus - Safe Meetup Locations

export const CAMPUS_LOCATIONS = [
  {
    name: 'Main Entrance',
    fullName: 'Main Entrance (4500 Wascana Pkwy)',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4255,
    lng: -104.6189,
    description: 'Primary building entrance with security cameras',
    type: 'entrance'
  },
  {
    name: 'Library - Main Floor',
    fullName: 'Library - Main Floor',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4258,
    lng: -104.6192,
    description: 'Well-lit public space with staff present',
    type: 'indoor'
  },
  {
    name: 'Student Cafeteria',
    fullName: 'Student Cafeteria',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4260,
    lng: -104.6195,
    description: 'Busy common area during school hours',
    type: 'indoor'
  },
  {
    name: 'Main Parking Lot A',
    fullName: 'Main Parking Lot A',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4250,
    lng: -104.6180,
    description: 'Well-lit parking area near main entrance',
    type: 'outdoor'
  },
  {
    name: 'Student Services Front Desk',
    fullName: 'Student Services Front Desk',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4257,
    lng: -104.6190,
    description: 'Staffed front desk area, safe and secure',
    type: 'indoor'
  },
  {
    name: 'Building A - Main Entrance',
    fullName: 'Building A - Main Entrance',
    address: '4500 Wascana Parkway, Regina, SK S4S 5X1',
    lat: 50.4262,
    lng: -104.6188,
    description: 'Secondary entrance with good visibility',
    type: 'entrance'
  }
];

// Helper function to get location by name
export const getLocationByName = (name) => {
  return CAMPUS_LOCATIONS.find(loc => 
    loc.name === name || loc.fullName === name
  );
};

// Helper function to get Google Maps link
export const getGoogleMapsLink = (location) => {
  if (typeof location === 'string') {
    const loc = getLocationByName(location);
    if (loc) {
      return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    }
    return null;
  }
  return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
};

// Helper function to get directions link
export const getDirectionsLink = (location) => {
  const loc = typeof location === 'string' ? getLocationByName(location) : location;
  if (loc) {
    return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
  }
  return null;
};
