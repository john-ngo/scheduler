import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState(prev => ({ ...prev, day }));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  function updateSpots(id) {
    setState(prev => {
      const days = [];
      let index = 0;
      let spots = 0;

      for (let i = 0; i < prev.days.length; i++) {
        days.push({ ...prev.days[i] });

        if (prev.days[i].appointments.includes(id)) {
          index = i;
        }
      }

      for (const key of prev.days[index].appointments) {
        if (prev.appointments[key].interview === null) {
          spots++;
        }
      }

      days[index].spots = spots;

      return { ...prev, days };
    });
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState(prev => {
          const appointment = {
            ...prev.appointments[id],
            interview: { ...interview }
          };
          const appointments = {
            ...prev.appointments,
            [id]: appointment
          };

          return { ...prev, appointments };
        });
        updateSpots(id);
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState(prev => {
          const appointment = {
            ...prev.appointments[id],
            interview: null
          };
          const appointments = {
            ...prev.appointments,
            [id]: appointment
          };

          return { ...prev, appointments };
        });
        updateSpots(id);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}