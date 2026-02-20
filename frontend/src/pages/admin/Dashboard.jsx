import {
  TrendingUp,
  Users,
  ShoppingBag,
  CalendarDays,
  PlusCircle,
  ClipboardList,
  ChefHat,
} from "lucide-react";

const stats = [
  {
    title: "Total Orders",
    value: "1,248",
    trend: "+12%",
    icon: ShoppingBag,
  },
  {
    title: "Today Bookings",
    value: "36",
    trend: "+6%",
    icon: CalendarDays,
  },
  {
    title: "New Customers",
    value: "92",
    trend: "+18%",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$18,420",
    trend: "+9%",
    icon: TrendingUp,
  },
];

const quickActions = [
  {
    title: "Add Menu Item",
    description: "Create seasonal dishes and promos.",
    icon: ChefHat,
  },
  {
    title: "Add Category",
    description: "Organize menu sections in seconds.",
    icon: PlusCircle,
  },
  {
    title: "Review Orders",
    description: "Track prep and delivery status.",
    icon: ClipboardList,
  },
];

const recentOrders = [
  { id: "#ORD-1041", customer: "Evelyn Park", total: "$84.00", status: "Preparing" },
  { id: "#ORD-1038", customer: "Kiran Patel", total: "$52.50", status: "Completed" },
  { id: "#ORD-1033", customer: "Mia Stone", total: "$37.20", status: "On the way" },
];

const upcomingBookings = [
  { id: "#BK-221", name: "Amir Khan", time: "7:30 PM", party: "4 guests" },
  { id: "#BK-218", name: "Sofia Rossi", time: "8:00 PM", party: "2 guests" },
  { id: "#BK-214", name: "Noah Reed", time: "8:45 PM", party: "6 guests" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
            Admin Overview
          </p>
          <h1 className="text-3xl font-semibold text-stone-900">
            Black Pepper Dashboard
          </h1>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-500 shadow-sm">
          Tonight capacity: <span className="font-semibold text-stone-900">78%</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-emerald-600">
                  {item.trend}
                </span>
              </div>
              <p className="mt-4 text-sm text-stone-500">{item.title}</p>
              <p className="text-2xl font-semibold text-stone-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">
              Quick Actions
            </h2>
            <span className="text-xs text-stone-400">Last updated 5m ago</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="h-9 w-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-stone-900">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-500">
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Service Snapshot</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <span className="text-stone-500">Active tables</span>
              <span className="font-semibold text-stone-900">12</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <span className="text-stone-500">Kitchen queue</span>
              <span className="font-semibold text-stone-900">7 tickets</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <span className="text-stone-500">Avg. prep time</span>
              <span className="font-semibold text-stone-900">18 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Recent Orders</h2>
          <div className="mt-5 space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-stone-400">
                    {order.id} · {order.status}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {order.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Upcoming Bookings</h2>
          <div className="mt-5 space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {booking.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {booking.id} · {booking.party}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {booking.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
