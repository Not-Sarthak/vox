import React from 'react';

interface TicketSection {
  section: string;
  row: string;
  view: string;
  remaining: number;
}

interface MostSoldTicketsProps {
  tickets: TicketSection[];
  onTicketSelect: (ticket: TicketSection) => void;
}

interface TicketSectionCardProps extends TicketSection {
  onSelect: (ticket: TicketSection) => void;
}

const TicketSectionCard: React.FC<TicketSectionCardProps> = ({ section, row, view, remaining, onSelect }) => {
  const getBgColor = (remaining: number) => {
    if (remaining < 5) return 'bg-[#FFADB9] text-[#A9004F] border-[#FF606B] border-[1.5px]';
    if (remaining < 20) return 'bg-[#FFF0AD] text-[#A96600] border-[#FFCA60] border-[1.5px]';
    return 'bg-[#CEFFAD] text-[#44A900] border-[#A0FF60] border-[1.5px]';
  };

  const handleClick = () => {
    onSelect({ section, row, view, remaining });
  };

  return (
    <div 
      className="bg-[#F7F7F7] p-4 rounded-lg border-[2px] border-dashed border-[#D6D6D6] cursor-pointer transition-all duration-300 hover:shadow-md"
      onClick={handleClick}
    >
      <h3 className="text-lg mb-1">{section}</h3>
      <p className="text-[#787878] text-sm mb-2">{row} · {view}</p>
      <div className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${getBgColor(remaining)}`}>
        {remaining} tickets remaining
      </div>
    </div>
  );
};

const MostSoldTickets: React.FC<MostSoldTicketsProps> = ({ tickets, onTicketSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tickets.map((ticket, index) => (
        <TicketSectionCard key={index} {...ticket} onSelect={onTicketSelect} />
      ))}
    </div>
  );
};

export default MostSoldTickets;