import events from "@/utils/events";
import buy from "@/utils/buy";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getShowsByEventId, getShowsByName } from "@/app/_actions";

export const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

export interface SellItem {
  title: string;
  bgImage: string;
  description: string;
  location: string;
  dateRange: string;
  trending: {
    status: boolean;
    metric: string;
  };
  shows: Array<{
    id: number;
    date: string;
    day: string;
    time: string;
    price: number;
    currency: string;
    bestSelling?: boolean;
  }>;
  mostSoldTickets: Array<{
    section: string;
    row: string;
    view: string;
    remaining: number;
  }>;
  otherLocations: string[];
}

interface SellState {
  items: SellItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
}

export const useSellStore = create<SellState>()(
  devtools((set) => ({
    items: [],
    isLoading: false,
    error: null,
    fetchItems: async () => {
      set({ isLoading: true });
      try {
        const data = events;
        set({ items: data, isLoading: false });
      } catch (error) {
        set({ error: "Failed to fetch sell items", isLoading: false });
      }
    },
  }))
);

export interface BuyItem {
  id?: number;
  title: string;
  bgImage: string;
  description: string;
  location: string;
  dateRange: string;
  trending: {
    status: boolean;
    metric: string;
  };
  shows: Array<{
    id: number;
    ticketId?: number;
    date: string;
    day: string;
    time: string;
    price: number;
    currency: string;
    bestSelling?: boolean;
  }>;
  mostSoldTickets: Array<{
    section: string;
    row: string;
    view: string;
    remaining: number;
  }>;
  otherLocations: string[];
}

interface BuyState {
  items: BuyItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchConcerts: () => Promise<void>;
}

export const useBuyStore = create<BuyState>()(
  devtools((set) => ({
    items: [],
    isLoading: false,
    error: null,
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
    fetchConcerts: async () => {
      set({ isLoading: true });
      try {
        const data = buy;
        set({ items: data, isLoading: false });
      } catch (error) {
        set({ error: "Failed to fetch buy items", isLoading: false });
      }
    },
  }))
);

interface CheckoutItem {
  eventId: number;
  eventTitle: string;
  showDate: string;
  showTime: string;
  ticketSection: string;
  ticketRow: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  email: string;
}

interface CheckoutState {
  items: CheckoutItem[];
  addToCheckout: (item: CheckoutItem) => void;
  removeFromCheckout: (eventId: number) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  items: [],
  addToCheckout: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeFromCheckout: (eventId) =>
    set((state) => ({
      items: state.items.filter((item) => item.eventId !== eventId),
    })),
  clearCheckout: () => set({ items: [] }),
}));

export type TicketType =
  | "Paper"
  | "E-Ticket"
  | "Mobile QR Code"
  | "Mobile Ticket Transfer";
export type SplitPreference =
  | "No preference"
  | "Avoid leaving 1 ticket"
  | "Sell together";

interface FormData {
  ticketType: TicketType;
  numberOfTickets: number;
  splitPreference: SplitPreference;
  section: string;
  row: string;
  fromSeat: string;
  toSeat: string;
  price: number;
  useSlippage: boolean;
  slippagePercentage: number;
  uploadedFile: File | null;
}

interface SellFormState extends FormData {
  errors: Record<string, string>;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  setUploadedFile: (file: File | null) => void;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
}

export const useSellFormStore = create<SellFormState>((set, get) => ({
  ticketType: "E-Ticket",
  numberOfTickets: 1,
  splitPreference: "No preference",
  section: "",
  row: "",
  fromSeat: "",
  toSeat: "",
  price: 0,
  useSlippage: false,
  slippagePercentage: 0,
  errors: {},
  uploadedFile: null,

  setField: (key, value) => {
    console.log(`Setting ${key} to:`, value);
    set({ [key]: value });
    get().validateForm();
  },
  setUploadedFile: (file: File | null) => {
    set({ uploadedFile: file });
    get().validateForm();
  },

  validateForm: () => {
    const state = get();
    const errors: Record<string, string> = {};

    if (!state.section) errors.section = "Section is required";
    if (!state.row) errors.row = "Row is required";
    if (!state.fromSeat) errors.fromSeat = "From seat is required";
    if (state.numberOfTickets > 1 && !state.toSeat)
      errors.toSeat = "To seat is required";
    if (state.price <= 0) errors.price = "Price must be greater than 0";
    if (
      state.useSlippage &&
      (state.slippagePercentage <= 0 || state.slippagePercentage > 100)
    ) {
      errors.slippagePercentage =
        "Slippage percentage must be between 1 and 100";
    }
    if (
      (state.ticketType === "E-Ticket" ||
        state.ticketType === "Mobile QR Code") &&
      !state.uploadedFile
    ) {
      errors.uploadedFile = "Please upload your ticket";
    }

    console.log("Validation errors:", errors);
    set({ errors });
    return Object.keys(errors).length === 0;
  },

  submitForm: async () => {
    const isValid = get().validateForm();
    if (!isValid) {
      console.log("Form validation failed");
      return;
    }

    const formData = {
      ticketType: get().ticketType,
      numberOfTickets: get().numberOfTickets,
      splitPreference: get().splitPreference,
      section: get().section,
      row: get().row,
      fromSeat: get().fromSeat,
      toSeat: get().toSeat,
      price: get().price,
      useSlippage: get().useSlippage,
      slippagePercentage: get().slippagePercentage,
      uploadedFile: get().uploadedFile,
    };

    console.log("Submitting form data:", formData);
    console.log("Form submitted successfully");
  },
}));

interface BidState {
  currentBid: number | null;
  setBid: (amount: number) => void;
}

export const useBidStore = create<BidState>()(
  devtools((set) => ({
    currentBid: null,
    setBid: (amount) => set({ currentBid: amount }),
  }))
);
