export function getAppointmentsForDay(state, day) {
  const appointments = [];
  const filteredAppointments = state.days.filter(stateDay => stateDay.name === day);

  if (state.days.length === 0 || filteredAppointments.length === 0) {
    return [];
  }

  const appointmentIds = filteredAppointments[0].appointments;

  for (const id in state.appointments) {
    if (appointmentIds.includes(Number(id))) {
      appointments.push(state.appointments[id]);
    }
  }

  return appointments;
}

function objectCompare(obj1, obj2) {
  if (obj1 === null || obj2 === null) {
    return false;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

export function getInterview(state, interview) {
  const interviewData = {};

  for (const id in state.appointments) {
    if (objectCompare(state.appointments[id].interview, interview)) {
      interviewData.student = interview.student;
      interviewData.interviewer = state.interviewers[interview.interviewer.toString()];

      return interviewData;
    }
  }

  return null;
}

export function getInterviewersForDay(state, day) {
  const interviewers = [];
  const filteredInterviewers = state.days.filter(stateDay => stateDay.name === day);

  if (state.days.length === 0 || filteredInterviewers.length === 0) {
    return [];
  }

  const interviewerIds = filteredInterviewers[0].interviewers;

  for (const id in state.interviewers) {
    if (interviewerIds.includes(Number(id))) {
      interviewers.push(state.interviewers[id]);
    }
  }

  return interviewers;
}