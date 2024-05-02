import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HiPlus } from "react-icons/hi";
import NewSaleModal from "../../components/modal/NewSaleModal";
import venteData from "./Renovhanbitat.vente.json";
import frLocale from '@fullcalendar/core/locales/fr';

function parseFrenchDate(dateStr) {
  let [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');

  // Handle two-digit year by assuming 20th or 21st century
  const fullYear = year.length === 2 ? (parseInt(year, 10) < 50 ? `20${year}` : `19${year}`) : year;

  // Default to midnight if no time part is provided
  const [hours = '00', minutes = '00', seconds = '00'] = timePart ? timePart.split(':') : [];

  return new Date(fullYear, month - 1, day, hours, minutes, seconds);
}




export const WeeklyCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventList = venteData.map(sale => {
      try {
        const date = parseFrenchDate(sale["Heure"]);
        return {
          title: `${sale["NOM DU CLIENT"]} - ${sale["DESIGNATION"]}`,
          start: date,
          allDay: true,
        };
      } catch (error) {
        console.error("Invalid date found:", sale["Heure"], error);
        return null;
      }
    }).filter(event => event !== null);

    setEvents(eventList);
  }, []);

  const handleDateClick = (arg) => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddSale = (newSale) => {
    try {
        const date = parseFrenchDate(newSale["Heure"]);
        const newEvent = {
            title: `${newSale["NOM DU CLIENT"]} - ${newSale["DESIGNATION"]}`,
            start: date,
            allDay: true
        };
        setEvents([...events, newEvent]);
        setModalOpen(false);
    } catch (error) {
        console.error("Error parsing date:", newSale["Heure"], error);
    }
};

  return (
    <div style={{ position: "relative" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        // initialView="dayGridDay"
        initialView="dayGridMonth"

        hiddenDays={[0]} // Hide Sunday
        dateClick={handleDateClick}
        events={events}
        locale={frLocale} // Set locale to French
        eventClassNames="bg-[#2B1C56] text-white p-2 rounded-md"
      />
      {modalOpen && (
        <NewSaleModal onClose={handleModalClose} onAdd={handleAddSale} />
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <HiPlus
          className="text-4xl cursor-pointer"
          onClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default WeeklyCalendar;
