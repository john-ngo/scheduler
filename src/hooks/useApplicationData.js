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
  }, [state]);

  function updateSpots(id) {
    const days = [];
    let index = 0;
    let spots = 0;

    for (let i = 0; i < state.days.length; i++) {
      days.push(state.days[i]);

      if (state.days[i].appointments.includes(id)) {
        index = i;
      }
    }

    for (const key of state.days[index].appointments) {
      if (state.appointments[key] !== null) {
        spots++;
      }
    }

    days[index].spots = spots;

    setState(prev => ({ ...prev, days }));
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState(prev => ({ ...prev, appointments }));
        updateSpots(id);
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState(prev => ({ ...prev, appointments }));
        updateSpots(id);
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}