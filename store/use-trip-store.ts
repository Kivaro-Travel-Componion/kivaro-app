import { create } from "zustand";

export type TripExpense = {
  id: string;
  name: string;
  totalAmount: number;
  currency: string;
  date: string;
  category: "food" | "transport" | "accommodation" | "activity" | "shopping" | "other";
  items: { name: string; price: number }[];
  tax?: number;
  tip?: number;
  note?: string;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  coverEmoji: string;
  expenses: TripExpense[];
};

type TripStore = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addExpenseToTrip: (tripId: string, expense: TripExpense) => void;
  getTotalSpent: (tripId: string) => number;
};

export const useTripStore = create<TripStore>((set:any, get:any) => ({
  // Mock data — replace with your real data source
  trips: [
    {
      id: "trip-1",
      name: "Vietnam Road Trip",
      destination: "Hà Nội → Đà Nẵng → Hội An",
      startDate: "2025-03-01",
      endDate: "2025-03-15",
      budget: 15000000,
      currency: "VND",
      coverEmoji: "🛵",
      expenses: [],
    },
    {
      id: "trip-2",
      name: "Bangkok Getaway",
      destination: "Bangkok, Thailand",
      startDate: "2025-04-10",
      endDate: "2025-04-17",
      budget: 1200,
      currency: "USD",
      coverEmoji: "🏯",
      expenses: [],
    },
  ],

  setTrips: (trips: any) => set({ trips }),

  addExpenseToTrip: (tripId:any, expense:any) =>
    set((state:any) => ({
      trips: state.trips.map((trip:any) =>
        trip.id === tripId
          ? { ...trip, expenses: [...trip.expenses, expense] }
          : trip
      ),
    })),

  getTotalSpent: (tripId:any) => {
    const trip = get().trips.find((t:any) => t.id === tripId);
    if (!trip) return 0;
    return trip.expenses.reduce((sum:any, e:any) => sum + e.totalAmount, 0);
  },
}));