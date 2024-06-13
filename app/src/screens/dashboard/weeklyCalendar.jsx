import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HiPlus } from "react-icons/hi";
import frLocale from "@fullcalendar/core/locales/fr";
import { useHistory } from "react-router-dom";

// import './WeeklyCalendar.css';
export const WeeklyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/ventes/all", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      const eventList = data.data
        .filter((sale) => sale["DATE DE VENTE"])
        .map((sale) => {
          try {
            const date = new Date(sale["DATE DE VENTE"]);
            const formattedDate = date.toISOString().split("T")[0];
            return {
              id: sale._id,
              title: `${sale["NOM DU CLIENT"]} - ${sale["DESIGNATION"]}`,
              start: formattedDate,
              allDay: true,
            };
          } catch (error) {
            console.error("Invalid date found:", sale["DATE DE VENTE"], error);
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

  const handleDateClick = (arg) => {
    history.push(`/projects/${arg.dateStr}`);
  };

  const handleEventDrop = async (info) => {
    const { event } = info;
    const newDate = new Date(
      event.start.getTime() - event.start.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    console.log("Dropped event:", event.title);
    console.log("New date:", newDate);
    console.log("Original date:", event.start);

    const updatedSale = {
      ...event.extendedProps,
      "DATE DE VENTE": newDate, // Ensure the date is in 'YYYY-MM-DD' format
    };

    try {
      const response = await fetch(`http://localhost:8080/ventes/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials in the request
        body: JSON.stringify(updatedSale),
      });

      if (!response.ok) {
        throw new Error("Failed to update sale date");
      }

      console.log("Updated event:", updatedSale);

      // Fetch the updated events from the server
      await fetchSalesData();
    } catch (error) {
      console.error("Error updating sale date:", error);
      setError("Failed to update event date. Please try again.");
      info.revert(); // Revert the event back to its original position if the update fails
    }
  };

  return (
    <div
      style={{ position: "relative", backgroundColor: "#0A3A31" }}
      className="rounded-md px-4"
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth", // Only month view
        }}
        hiddenDays={[0]} // Show all days of the week
        dateClick={handleDateClick}
        events={events}
        locale={frLocale}
        eventClassNames="bg-[#2da58d] text-white p-2 rounded-md border-[#26685A]"
        editable={true} // Enable dragging and resizing
        droppable={true} // Enable dragging from outside
        eventDrop={handleEventDrop} // Handle event drop
        height="auto" // Ensure calendar is not scrollable and fits content
        dayHeaderClassNames="bg-[#2da58d] text-white" // Custom class for header
        dayCellClassNames="border border-gray-200" // Ensure all days have the same size
        
      />
    </div>
  );
};

export default WeeklyCalendar;
