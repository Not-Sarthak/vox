export type TTicket = {
  ticketId: number;
  eventId: number;
  seatDetails: {
    seatNumber: number;
    row?: number;
    section?: string;
  };
  price: number;
  ticketUrl?: string;
};

export type TEventDetails = {
  id: number;
  name: string;
  time: string;
  location: string;
};
