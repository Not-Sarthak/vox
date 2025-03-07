const buy = [
  {
    title: "Coldplay",
    bgImage: "/buy/coldplay.svg",
    description:
      "Coldplay is a British rock band, formed in 1997 by University College London classmates Chris Martin (vocals, guitar, piano), Jonny Buckland (guitar) and Guy Berryman (bass), along with drummer Will Champion. The band's name comes from Tim Crompton, a student who was in the same university as the members (University College London) at the time. They were previously known as Pectoralz, then changed their name to Starfish in 1997 before finally settling on the name Coldplay. Once they issued their debut, Parachutes in 2000, many saw them as a Radiohead knock-off...",
    location: "Mumbai",
    dateRange: "18-21st January 2025",
    trending: {
      status: true,
      metric: "161 Hug x 19 Hug",
    },
    shows: [
      {
        id: 1,
        date: "18 January 2025",
        day: "Friday",
        time: "12:30 PM",
        price: 24035,
        currency: "₹",
      },
      {
        id: 2,
        date: "19 January 2025",
        day: "Saturday",
        time: "12:30 PM",
        price: 31255,
        currency: "₹",
        bestSelling: true,
      },
      {
        id: 3,
        date: "21 January 2025",
        day: "Monday",
        time: "12:30 PM",
        price: 42130,
        currency: "₹",
      },
    ],
    mostSoldTickets: [
      {
        section: "Section Level 1 M",
        row: "Row M",
        view: "Clear view",
        remaining: 2,
      },
      {
        section: "Floor",
        row: "Standing only",
        view: "Clear view",
        remaining: 12,
      },
      {
        section: "Section Level 3 L",
        row: "Row L",
        view: "Side or rear view",
        remaining: 2,
      },
      {
        section: "Section Level 2 O",
        row: "Row O",
        view: "Side or rear view",
        remaining: 2,
      },
    ],
    otherLocations: ["India", "Vietnam", "Singapore"],
  },
];

export default buy;
