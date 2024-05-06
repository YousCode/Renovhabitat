import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HiPlus } from "react-icons/hi";
import NewSaleModal from "../../components/modal/NewSaleModal";
// import venteData from "./Renovhanbitat.vente.json";
import frLocale from "@fullcalendar/core/locales/fr";
import { useHistory } from "react-router-dom";


// function parseFrenchDate(dateStr) {
//     if (!dateStr) {
//         throw new Error("Invalid or undefined date string");
//     }

//     let [datePart, timePart] = dateStr.split(" ");
//     const [day, month, year] = datePart.split("/");

//     const fullYear =
//         year.length === 2
//             ? parseInt(year, 10) < 50
//                 ? `20${year}`
//                 : `19${year}`
//             : year;

//     const [hours = "00", minutes = "00", seconds = "00"] = timePart
//         ? timePart.split(":")
//         : [];

//     return new Date(fullYear, month - 1, day, hours, minutes, seconds);
// }

export const WeeklyCalendar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const history = useHistory();
    


  useEffect(() => {
    const fetchSalesData = async () => {
        try {
            const response = await fetch("http://localhost:8080/ventes/all");

            // Check if response is OK and JSON
            if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
                const data = await response.json();
                const eventList = data.map((sale) => {
                    try {
                        const date = new Date(sale["DATE DE VENTE"]);
                        return {
                            title: `${sale["NOM DU CLIENT"]} - ${sale["DESIGNATION"]}`,
                            start: date,
                            allDay: true,
                        };
                    } catch (error) {
                        console.error("Invalid date found:", sale["DATE DE VENTE"], error);
                        return null;
                    }
                }).filter((event) => event !== null);

                setEvents(eventList);
            } else {
                console.error("Unexpected response:", response);
                throw new Error("Unexpected response format.");
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    fetchSalesData();
}, []);

// useEffect(() => {
//     const applyCustomStyles = () => {
//         // Query and style day cells
//         document.querySelectorAll('.fc .fc-daygrid-day').forEach(el => {
//             el.classList.add('border-black'); // Adds black border to day cells
//         });

//         // Query and style day numbers
//         document.querySelectorAll('.fc .fc-daygrid-day-number').forEach(el => {
//             el.classList.add('text-black'); // Adds black text to day numbers
//         });

//         // Query and style day tops if necessary
//         document.querySelectorAll('.fc .fc-day-top').forEach(el => {
//             el.classList.add('text-black'); // Ensures top of day labels are also black
//         });
//     };

//     applyCustomStyles();
//     const observer = new MutationObserver(applyCustomStyles);
//     observer.observe(document.querySelector('.fc'), { childList: true, subtree: true });

//     // Cleanup observer on component unmount
//     return () => observer.disconnect();
// }, []);

    const handleDateClick = (arg) => {
      history.push(`/projects/${arg.dateStr}`);
    };
  

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleAddSale = async (newSale) => {
      try {
          const date = new Date(newSale["DATE DE VENTE"]);
          const newEvent = {
              title: `${newSale["NOM DU CLIENT"]} - ${newSale["DESIGNATION"]}`,
              start: date,
              allDay: true,
          };
  
          const response = await fetch("/ventes", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(newSale),
          });
  
          if (response.ok) {
              setEvents([...events, newEvent]);
              setModalOpen(false);
          } else {
              console.error("Error creating new sale:", await response.text());
          }
      } catch (error) {
          console.error("Error parsing date:", newSale["DATE DE VENTE"], error);
      }
  };
  

    return (
        <div style={{ position: "relative" }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                hiddenDays={[0]}
                dateClick={handleDateClick}
                events={events}
                locale={frLocale}
                eventClassNames="bg-[#2B1C56] text-white p-2 rounded-md"
            />
            {modalOpen && (
                <NewSaleModal onClose={handleModalClose} onAdd={handleAddSale} />
            )}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <HiPlus className="text-4xl cursor-pointer" onClick={handleDateClick} />
            </div>
        </div>
    );
};

export default WeeklyCalendar;
