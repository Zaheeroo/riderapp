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

export const dummyCustomersExtended = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    status: "Active",
    location: "Jaco Beach",
    joinDate: "2024-01-15",
    totalRides: 8,
    totalSpent: 680.00,
    lastRide: "2024-02-25",
    preferredPayment: "Credit Card",
    rating: 4.9,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email + SMS"
    }
  },
  {
    id: 2,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 234-567-8901",
    status: "Active",
    location: "Tamarindo",
    joinDate: "2024-01-20",
    totalRides: 5,
    totalSpent: 475.00,
    lastRide: "2024-02-25",
    preferredPayment: "PayPal",
    rating: 4.8,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email"
    }
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234-567-8902",
    status: "Inactive",
    location: "Manuel Antonio",
    joinDate: "2024-02-01",
    totalRides: 2,
    totalSpent: 90.00,
    lastRide: "2024-02-25",
    preferredPayment: "Cash",
    rating: 4.7,
    preferences: {
      language: "Spanish",
      currency: "USD",
      notifications: "SMS"
    }
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

export const dummyDriverRides = {
  upcomingRides: [
    {
      id: "ride-001",
      customer: {
        name: "John Smith",
        phone: "+1 234-567-8900",
        rating: 4.8
      },
      pickup: "Jaco Beach",
      dropoff: "Manuel Antonio",
      date: "2024-03-10",
      time: "10:00 AM",
      status: "Confirmed",
      price: 85.00,
      distance: "45 km",
      duration: "1h 15m",
      paymentMethod: "Credit Card"
    },
    {
      id: "ride-002",
      customer: {
        name: "Emma Wilson",
        phone: "+1 234-567-8901",
        rating: 4.9
      },
      pickup: "Liberia Airport",
      dropoff: "Tamarindo",
      date: "2024-03-10",
      time: "2:00 PM",
      status: "Confirmed",
      price: 95.00,
      distance: "65 km",
      duration: "1h 30m",
      paymentMethod: "PayPal"
    }
  ],
  completedRides: [
    {
      id: "ride-003",
      customer: {
        name: "Michael Brown",
        phone: "+1 234-567-8902",
        rating: 4.7
      },
      pickup: "Manuel Antonio",
      dropoff: "Quepos Airport",
      date: "2024-03-09",
      time: "4:30 PM",
      status: "Completed",
      price: 45.00,
      distance: "15 km",
      duration: "25m",
      paymentMethod: "Cash",
      rating: 5,
      feedback: "Great service, very punctual!"
    },
    {
      id: "ride-004",
      customer: {
        name: "Sarah Davis",
        phone: "+1 234-567-8903",
        rating: 4.6
      },
      pickup: "Tamarindo",
      dropoff: "Playa Flamingo",
      date: "2024-03-09",
      time: "11:00 AM",
      status: "Completed",
      price: 35.00,
      distance: "20 km",
      duration: "30m",
      paymentMethod: "Credit Card",
      rating: 4,
      feedback: "Nice ride, comfortable vehicle"
    }
  ]
};

export const dummyDriverEarnings = {
  summary: {
    today: {
      total: 245.00,
      rides: 5,
      tips: 20.00,
      onlineHours: 8
    },
    week: {
      total: 1250.00,
      rides: 28,
      tips: 95.00,
      onlineHours: 45,
      topDestinations: [
        { name: "Manuel Antonio", rides: 8, earnings: 680.00 },
        { name: "Tamarindo", rides: 6, earnings: 570.00 }
      ]
    },
    month: {
      total: 4500.00,
      rides: 112,
      tips: 380.00,
      onlineHours: 180,
      averageRating: 4.8
    }
  },
  recentTransactions: [
    {
      id: "tx-001",
      date: "2024-03-09",
      type: "Ride",
      amount: 85.00,
      status: "Completed",
      customer: "John Smith",
      paymentMethod: "Credit Card"
    },
    {
      id: "tx-002",
      date: "2024-03-09",
      type: "Tip",
      amount: 10.00,
      status: "Completed",
      customer: "John Smith",
      paymentMethod: "Credit Card"
    },
    {
      id: "tx-003",
      date: "2024-03-09",
      type: "Ride",
      amount: 95.00,
      status: "Completed",
      customer: "Emma Wilson",
      paymentMethod: "PayPal"
    }
  ],
  paymentSchedule: {
    nextPayout: "2024-03-15",
    pendingAmount: 580.00,
    payoutMethod: "Bank Transfer",
    bankAccount: "****1234"
  },
  statistics: {
    peakHours: [
      { hour: "8-10 AM", rides: 25, earnings: 1200.00 },
      { hour: "4-6 PM", rides: 22, earnings: 1100.00 }
    ],
    popularRoutes: [
      { route: "Liberia Airport - Tamarindo", rides: 15, earnings: 1425.00 },
      { route: "Jaco - Manuel Antonio", rides: 12, earnings: 1020.00 }
    ],
    ratings: {
      overall: 4.8,
      lastMonth: 4.9,
      breakdown: {
        5: 85,
        4: 20,
        3: 5,
        2: 1,
        1: 0
      }
    }
  }
};

export const dummyCustomerRides = {
  upcomingRides: [
    {
      id: "ride-001",
      driver: {
        name: "Carlos Martinez",
        phone: "+506 8888-1111",
        rating: 4.8,
        vehicle: {
          model: "Toyota Fortuner",
          color: "Silver",
          plate: "CRC-123"
        }
      },
      pickup: "Jaco Beach",
      dropoff: "Manuel Antonio",
      date: "2024-03-10",
      time: "10:00 AM",
      status: "Confirmed",
      price: 85.00,
      distance: "45 km",
      duration: "1h 15m",
      paymentMethod: "Credit Card"
    },
    {
      id: "ride-002",
      driver: {
        name: "Maria Rodriguez",
        phone: "+506 8888-2222",
        rating: 4.9,
        vehicle: {
          model: "Honda CR-V",
          color: "White",
          plate: "CRC-456"
        }
      },
      pickup: "Liberia Airport",
      dropoff: "Tamarindo",
      date: "2024-03-12",
      time: "2:00 PM",
      status: "Scheduled",
      price: 95.00,
      distance: "65 km",
      duration: "1h 30m",
      paymentMethod: "PayPal"
    }
  ],
  completedRides: [
    {
      id: "ride-003",
      driver: {
        name: "Juan Perez",
        rating: 4.7,
        vehicle: {
          model: "Hyundai Tucson",
          color: "Black",
          plate: "CRC-789"
        }
      },
      pickup: "Manuel Antonio",
      dropoff: "Quepos Airport",
      date: "2024-03-08",
      time: "4:30 PM",
      status: "Completed",
      price: 45.00,
      distance: "15 km",
      duration: "25m",
      paymentMethod: "Cash",
      rating: {
        given: 5,
        comment: "Excellent service and very professional driver"
      }
    },
    {
      id: "ride-004",
      driver: {
        name: "Ana Mora",
        rating: 4.8,
        vehicle: {
          model: "Toyota RAV4",
          color: "Blue",
          plate: "CRC-101"
        }
      },
      pickup: "Tamarindo",
      dropoff: "Playa Flamingo",
      date: "2024-03-07",
      time: "11:00 AM",
      status: "Completed",
      price: 35.00,
      distance: "20 km",
      duration: "30m",
      paymentMethod: "Credit Card",
      rating: {
        given: 4,
        comment: "Good ride, would book again"
      }
    }
  ]
};

export const dummyBookingData = {
  popularDestinations: [
    {
      name: "Manuel Antonio",
      image: "/destinations/manuel-antonio.jpg",
      description: "Beautiful national park and beaches",
      averagePrice: 85.00,
      distance: "45 km",
      duration: "1h 15m"
    },
    {
      name: "Tamarindo",
      image: "/destinations/tamarindo.jpg",
      description: "Surf town with great nightlife",
      averagePrice: 95.00,
      distance: "65 km",
      duration: "1h 30m"
    },
    {
      name: "Arenal Volcano",
      image: "/destinations/arenal.jpg",
      description: "Active volcano and hot springs",
      averagePrice: 150.00,
      distance: "135 km",
      duration: "3h"
    }
  ],
  vehicleTypes: [
    {
      id: "suv",
      name: "SUV",
      description: "Comfortable SUV for up to 6 passengers",
      basePrice: 85.00,
      image: "/vehicles/suv.jpg",
      features: ["Air Conditioning", "Luggage Space", "Child Seat Available"]
    },
    {
      id: "van",
      name: "Passenger Van",
      description: "Spacious van for up to 12 passengers",
      basePrice: 120.00,
      image: "/vehicles/van.jpg",
      features: ["Air Conditioning", "Extra Luggage Space", "WiFi"]
    },
    {
      id: "luxury",
      name: "Luxury SUV",
      description: "Premium SUV for a luxurious experience",
      basePrice: 150.00,
      image: "/vehicles/luxury.jpg",
      features: ["Leather Seats", "Premium Audio", "Refreshments"]
    }
  ],
  availableDrivers: [
    {
      id: 1,
      name: "Carlos Martinez",
      rating: 4.8,
      totalRides: 156,
      vehicle: {
        model: "Toyota Fortuner",
        year: "2023",
        color: "Silver"
      },
      status: "Available",
      estimatedArrival: "10 mins"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      rating: 4.9,
      totalRides: 203,
      vehicle: {
        model: "Honda CR-V",
        year: "2022",
        color: "White"
      },
      status: "Available",
      estimatedArrival: "15 mins"
    }
  ],
  paymentMethods: [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "credit-card",
      lastUsed: true
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "paypal",
      lastUsed: false
    },
    {
      id: "cash",
      name: "Cash",
      icon: "cash",
      lastUsed: false
    }
  ],
  promos: [
    {
      code: "WELCOME",
      description: "15% off your first ride",
      discount: 15,
      type: "percentage"
    },
    {
      code: "WEEKEND",
      description: "$10 off rides on weekends",
      discount: 10,
      type: "fixed"
    }
  ]
}; 