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
      id: "ride1",
      driver: {
        name: "Carlos M.",
        phone: "+506 8888-8888",
        rating: 4.8,
        avatar: "/avatars/driver1.jpg",
        vehicle: {
          model: "Toyota Camry",
          color: "Silver",
          plate: "SJO-1234"
        }
      },
      pickup: {
        location: "San José International Airport",
        time: "10:00 AM"
      },
      dropoff: {
        location: "Jaco Beach Resort",
        time: "11:30 AM"
      },
      date: "Mar 15, 2024",
      time: "10:00 AM",
      status: "Confirmed",
      payment: {
        amount: 85.00,
        method: "Visa ending in 4242"
      },
      distance: "95 km",
      duration: "1h 30m"
    },
    {
      id: "ride2",
      driver: {
        name: "Maria R.",
        phone: "+506 7777-7777",
        rating: 4.9,
        avatar: "/avatars/driver2.jpg",
        vehicle: {
          model: "Honda CR-V",
          color: "White",
          plate: "SJO-5678"
        }
      },
      pickup: {
        location: "Manuel Antonio National Park",
        time: "2:00 PM"
      },
      dropoff: {
        location: "Quepos Marina",
        time: "2:30 PM"
      },
      date: "Mar 16, 2024",
      time: "2:00 PM",
      status: "Pending",
      payment: {
        amount: 45.00,
        method: "PayPal"
      },
      distance: "7 km",
      duration: "30m"
    }
  ],
  completedRides: [
    {
      id: "ride3",
      driver: {
        name: "Juan D.",
        phone: "+506 6666-6666",
        rating: 4.7,
        avatar: "/avatars/driver3.jpg",
        vehicle: {
          model: "Toyota Fortuner",
          color: "Black",
          plate: "SJO-9012"
        }
      },
      pickup: {
        location: "Liberia International Airport",
        time: "1:00 PM"
      },
      dropoff: {
        location: "Tamarindo Beach",
        time: "2:30 PM"
      },
      date: "Mar 10, 2024",
      time: "1:00 PM",
      status: "Completed",
      payment: {
        amount: 95.00,
        method: "Credit Card"
      },
      distance: "80 km",
      duration: "1h 30m",
      customerRating: 5
    },
    {
      id: "ride4",
      driver: {
        name: "Ana L.",
        phone: "+506 5555-5555",
        rating: 4.9,
        avatar: "/avatars/driver4.jpg",
        vehicle: {
          model: "Hyundai Tucson",
          color: "Blue",
          plate: "SJO-3456"
        }
      },
      pickup: {
        location: "La Fortuna",
        time: "9:00 AM"
      },
      dropoff: {
        location: "Arenal Volcano National Park",
        time: "9:30 AM"
      },
      date: "Mar 8, 2024",
      time: "9:00 AM",
      status: "Completed",
      payment: {
        amount: 35.00,
        method: "Cash"
      },
      distance: "15 km",
      duration: "30m"
    }
  ]
};

export const dummyBookingData = {
  popularDestinations: [
    {
      id: "dest1",
      name: "Manuel Antonio National Park",
      image: "/destinations/manuel-antonio.jpg",
      description: "Beautiful beaches and wildlife",
      averagePrice: 120,
      distance: "45",
      duration: "60"
    },
    {
      id: "dest2",
      name: "Arenal Volcano",
      image: "/destinations/arenal.jpg",
      description: "Active volcano and hot springs",
      averagePrice: 150,
      distance: "85",
      duration: "120"
    },
    {
      id: "dest3",
      name: "Monteverde Cloud Forest",
      image: "/destinations/monteverde.jpg",
      description: "Unique cloud forest ecosystem",
      averagePrice: 135,
      distance: "65",
      duration: "90"
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
      id: "card1",
      name: "Visa ending in 4242",
      icon: "credit-card",
      lastUsed: true,
      isDefault: true
    },
    {
      id: "card2", 
      name: "PayPal",
      icon: "paypal",
      lastUsed: false,
      isDefault: false
    },
    {
      id: "card3",
      name: "Cash",
      icon: "cash",
      lastUsed: false,
      isDefault: false
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

export const dummyCommunication = {
  messages: [
    {
      id: "msg1",
      conversation_id: "conv1",
      sender_id: "driver1",
      sender_name: "Carlos M.",
      sender_type: "driver",
      receiver_id: "customer1",
      receiver_name: "John Smith",
      receiver_type: "customer",
      message: "I've arrived at the pickup location",
      type: "text",
      status: "delivered",
      created_at: "2024-02-22T14:30:00Z",
      ride_id: "ride1"
    },
    {
      id: "msg2",
      conversation_id: "conv1",
      sender_id: "customer1",
      sender_name: "John Smith",
      sender_type: "customer",
      receiver_id: "driver1",
      receiver_name: "Carlos M.",
      receiver_type: "driver",
      message: "Great, I'll be there in 2 minutes",
      type: "text",
      status: "read",
      created_at: "2024-02-22T14:31:00Z",
      ride_id: "ride1"
    },
    {
      id: "msg3",
      conversation_id: "conv2",
      sender_id: "admin1",
      sender_name: "Admin",
      sender_type: "admin",
      receiver_id: "driver1",
      receiver_name: "Carlos M.",
      receiver_type: "driver",
      message: "Please update your insurance documents",
      type: "text",
      status: "delivered",
      created_at: "2024-02-22T10:00:00Z"
    }
  ],
  notifications: {
    customer: [
      {
        id: "notif1",
        user_id: "customer1",
        type: "ride_status",
        title: "Driver Arrived",
        message: "Your driver Carlos M. has arrived at the pickup location",
        read: false,
        action_url: "/customer/rides",
        created_at: "2024-02-22T14:30:00Z"
      },
      {
        id: "notif2",
        user_id: "customer1",
        type: "payment",
        title: "Payment Successful",
        message: "Your payment of $85.00 for ride #ride1 was successful",
        read: true,
        action_url: "/customer/rides",
        created_at: "2024-02-22T13:00:00Z"
      }
    ],
    driver: [
      {
        id: "notif3",
        user_id: "driver1",
        type: "new_ride",
        title: "New Ride Request",
        message: "New ride request from John Smith",
        read: false,
        action_url: "/driver/rides",
        created_at: "2024-02-22T14:00:00Z"
      },
      {
        id: "notif4",
        user_id: "driver1",
        type: "document",
        title: "Document Expiring",
        message: "Your insurance document will expire in 15 days",
        read: false,
        action_url: "/driver/profile",
        created_at: "2024-02-22T09:00:00Z"
      }
    ],
    admin: [
      {
        id: "notif5",
        user_id: "admin1",
        type: "system_alert",
        title: "High Demand Alert",
        message: "Unusually high booking demand in Jaco Beach area",
        read: false,
        action_url: "/admin/rides",
        created_at: "2024-02-22T14:15:00Z"
      },
      {
        id: "notif6",
        user_id: "admin1",
        type: "driver_document",
        title: "Document Update Required",
        message: "5 drivers have documents expiring soon",
        read: true,
        action_url: "/admin/drivers",
        created_at: "2024-02-22T08:00:00Z"
      }
    ]
  },
  conversations: [
    {
      id: "conv1",
      type: "customer_driver",
      participants: [
        {
          id: "customer1",
          name: "John Smith",
          type: "customer",
          avatar: "/avatars/customer1.jpg"
        },
        {
          id: "driver1",
          name: "Carlos M.",
          type: "driver",
          avatar: "/avatars/driver1.jpg"
        }
      ],
      status: "active",
      last_message_at: "2024-02-22T14:31:00Z",
      ride_id: "ride1"
    },
    {
      id: "conv2",
      type: "admin_driver",
      participants: [
        {
          id: "admin1",
          name: "Admin",
          type: "admin",
          avatar: "/avatars/admin.jpg"
        },
        {
          id: "driver1",
          name: "Carlos M.",
          type: "driver",
          avatar: "/avatars/driver1.jpg"
        }
      ],
      status: "active",
      last_message_at: "2024-02-22T10:00:00Z"
    }
  ]
}; 