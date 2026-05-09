import { subDays } from 'date-fns'

export const DEMO_USER = {
  id: '665000000000000000000001',
  name: 'Demo Owner',
  email: 'demo@hisabkitab.local',
  businessName: 'Mumbai Tiffin Co.',
  language: 'en',
}

export const DEMO_CUSTOMERS = [
  {
    _id: '665000000000000000000101',
    userId: DEMO_USER.id,
    name: 'Amit Sharma',
    phone: '+919876543210',
    pendingAmount: 1250,
    totalPaid: 4200,
    notes: 'Monthly lunch plan',
    createdAt: subDays(new Date(), 10).toISOString(),
  },
  {
    _id: '665000000000000000000102',
    userId: DEMO_USER.id,
    name: 'Priya Mehta',
    phone: '+919812345678',
    pendingAmount: 780,
    totalPaid: 2600,
    notes: 'Prefers polite reminders',
    createdAt: subDays(new Date(), 6).toISOString(),
  },
  {
    _id: '665000000000000000000103',
    userId: DEMO_USER.id,
    name: 'Rahul Verma',
    phone: '+919900112233',
    pendingAmount: 0,
    totalPaid: 3300,
    notes: 'Paid through UPI',
    createdAt: subDays(new Date(), 3).toISOString(),
  },
]

export const DEMO_ORDERS = [
  {
    _id: '665000000000000000000201',
    userId: DEMO_USER.id,
    customerId: DEMO_CUSTOMERS[0]._id,
    customerName: DEMO_CUSTOMERS[0].name,
    description: 'Lunch tiffin - weekly pack',
    amount: 1500,
    status: 'partial',
    amountPaid: 250,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '665000000000000000000202',
    userId: DEMO_USER.id,
    customerId: DEMO_CUSTOMERS[1]._id,
    customerName: DEMO_CUSTOMERS[1].name,
    description: 'Dinner tiffin - 6 meals',
    amount: 780,
    status: 'pending',
    amountPaid: 0,
    createdAt: subDays(new Date(), 1).toISOString(),
  },
  {
    _id: '665000000000000000000203',
    userId: DEMO_USER.id,
    customerId: DEMO_CUSTOMERS[2]._id,
    customerName: DEMO_CUSTOMERS[2].name,
    description: 'Monthly breakfast add-on',
    amount: 1200,
    status: 'paid',
    amountPaid: 1200,
    createdAt: subDays(new Date(), 2).toISOString(),
  },
]

export const DEMO_INVENTORY = [
  {
    _id: '665000000000000000000301',
    userId: DEMO_USER.id,
    name: 'Rice',
    quantity: 4,
    unit: 'kg',
    restockThreshold: 5,
    costPerUnit: 62,
    needsRestock: true,
  },
  {
    _id: '665000000000000000000302',
    userId: DEMO_USER.id,
    name: 'Dal',
    quantity: 2,
    unit: 'kg',
    restockThreshold: 3,
    costPerUnit: 110,
    needsRestock: true,
  },
  {
    _id: '665000000000000000000303',
    userId: DEMO_USER.id,
    name: 'Containers',
    quantity: 70,
    unit: 'pieces',
    restockThreshold: 25,
    costPerUnit: 5,
    needsRestock: false,
  },
]

export function isDemoUser(userId) {
  return userId === DEMO_USER.id
}

export function getDemoCustomer(customerId) {
  return DEMO_CUSTOMERS.find((customer) => customer._id === customerId)
}

export function getDemoDashboard() {
  const today = new Date().toISOString().slice(0, 10)
  const totalPaid = DEMO_ORDERS.reduce((sum, order) => sum + order.amountPaid, 0)

  return {
    todayEarnings: DEMO_ORDERS.filter((order) => order.createdAt.startsWith(today)).reduce(
      (sum, order) => sum + order.amountPaid,
      0
    ),
    todayOrderCount: DEMO_ORDERS.filter((order) => order.createdAt.startsWith(today)).length,
    monthEarnings: totalPaid,
    totalPending: DEMO_CUSTOMERS.reduce((sum, customer) => sum + customer.pendingAmount, 0),
    customerCount: DEMO_CUSTOMERS.length,
    recentOrders: DEMO_ORDERS,
    lowStockItems: DEMO_INVENTORY.filter((item) => item.needsRestock),
    weeklyChart: DEMO_ORDERS.map((order) => ({
      _id: order.createdAt.slice(0, 10),
      earnings: order.amountPaid,
      orders: 1,
    })),
  }
}
