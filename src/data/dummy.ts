export const dummyCustomers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    upcomingRides: [
      {
        id: "ride-001",
        from: "Jaco Beach",
        to: "Manuel Antonio",
        date: "2024-02-25",
        time: "10:00 AM",
        status: "confirmed",
        driver: "Carlos M.",
        price: 85.00
      }
    ],
    pastRides: [
      {
        id: "ride-002",
        from: "Liberia Airport",
        to: "Tamarindo",
        date: "2024-02-20",
        time: "2:00 PM",
        status: "completed",
        driver: "Maria R.",
        price: 95.00
      }
    ]
  }
];

export const dummyDrivers = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos@jacorides.com",
    vehicle: {
      model: "Toyota Fortuner",
      year: "2023",
      plate: "CRC-123",
      seats: 6
    },
    rating: 4.8,
    totalRides: 156,
    todayRides: [
      {
        id: "ride-001",
        customer: "John Smith",
        from: "Jaco Beach",
        to: "Manuel Antonio",
        time: "10:00 AM",
        status: "upcoming",
        price: 85.00
      }
    ],
    earnings: {
      today: 245.00,
      week: 1250.00,
      month: 4500.00
    }
  }
];

export const dummyAdminStats = {
  overview: {
    totalDrivers: 25,
    activeDrivers: 18,
    totalCustomers: 450,
    totalRides: 1250
  },
  recentRides: [
    {
      id: "ride-001",
      customer: "John Smith",
      driver: "Carlos M.",
      from: "Jaco Beach",
      to: "Manuel Antonio",
      date: "2024-02-25",
      status: "confirmed",
      price: 85.00
    }
  ],
  earnings: {
    today: 2450.00,
    week: 12500.00,
    month: 45000.00
  },
  popularRoutes: [
    {
      route: "Liberia Airport - Tamarindo",
      rides: 45,
      avgPrice: 95.00
    },
    {
      route: "Jaco - Manuel Antonio",
      rides: 38,
      avgPrice: 85.00
    }
  ],
  allRides: [
    {
      id: "ride-001",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 234-567-8900"
      },
      driver: {
        name: "Carlos Martinez",
        rating: 4.8,
        vehicle: "Toyota Fortuner (CRC-123)"
      },
      ride: {
        from: "Jaco Beach",
        to: "Manuel Antonio",
        distance: "45 km",
        duration: "1h 15m"
      },
      payment: {
        amount: 85.00,
        method: "Credit Card",
        status: "Paid"
      },
      schedule: {
        date: "2024-02-25",
        time: "10:00 AM",
        status: "Confirmed"
      }
    },
    {
      id: "ride-002",
      customer: {
        name: "Emma Wilson",
        email: "emma@example.com",
        phone: "+1 234-567-8901"
      },
      driver: {
        name: "Maria Rodriguez",
        rating: 4.9,
        vehicle: "Honda CR-V (CRC-456)"
      },
      ride: {
        from: "Liberia Airport",
        to: "Tamarindo",
        distance: "65 km",
        duration: "1h 30m"
      },
      payment: {
        amount: 95.00,
        method: "PayPal",
        status: "Paid"
      },
      schedule: {
        date: "2024-02-25",
        time: "2:00 PM",
        status: "In Progress"
      }
    },
    {
      id: "ride-003",
      customer: {
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "+1 234-567-8902"
      },
      driver: {
        name: "Juan Perez",
        rating: 4.7,
        vehicle: "Hyundai Tucson (CRC-789)"
      },
      ride: {
        from: "Manuel Antonio",
        to: "Quepos Airport",
        distance: "15 km",
        duration: "25m"
      },
      payment: {
        amount: 45.00,
        method: "Cash",
        status: "Pending"
      },
      schedule: {
        date: "2024-02-25",
        time: "4:30 PM",
        status: "Scheduled"
      }
    }
  ]
}; 