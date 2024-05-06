import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HiPlus } from "react-icons/hi";
import frLocale from "@fullcalendar/core/locales/fr";
import { useHistory } from "react-router-dom";

export const WeeklyCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/ventes/all"); // Requête vers votre endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const data = await response.json();
        console.log(data);
        const eventList = data.data
        .filter((sale) => sale["DATE DE VENTE"]) // Filtrer les ventes sans date définie
        .map((sale) => {
            try {
              // Formater la date au format YYYY-MM-DD
              const date = new Date(sale["DATE DE VENTE"]);
              const formattedDate = date.toISOString().split("T")[0];
            //   console.log(formattedDate);
              return {
                  title: `${sale["NOM DU CLIENT"]} - ${sale["DESIGNATION"]}`,
                  start: formattedDate,
                  allDay: true,
                };
            } catch (error) {
                console.error(
                    "Invalid date found:",
                    sale["DATE DE VENTE"],
                    error
                );
                return null;
            }
        })
        .filter((event) => event !== null);

        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, []);

//   console.log(events);


  const handleDateClick = (arg) => {
    history.push(`/projects/${arg.dateStr}`);
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        hiddenDays={[0]}
        dateClick={handleDateClick}
        events={events}
        locale={frLocale}
        eventClassNames="bg-[#2B1C56] text-white p-2 rounded-md"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <HiPlus
          className="text-4xl cursor-pointer"
          onClick={() => setModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default WeeklyCalendar;
