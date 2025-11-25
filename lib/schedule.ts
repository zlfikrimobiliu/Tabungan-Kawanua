export interface ScheduleLike {
  dayOfWeek: number;
  time: string;
  startDate?: string;
}

export const getTimeParts = (time: string): [number, number] => {
  const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));
  return [Number.isNaN(hours) ? 0 : hours, Number.isNaN(minutes) ? 0 : minutes];
};

export const getNextOccurrence = (dayOfWeek: number, time: string, referenceDate: Date = new Date()): Date => {
  const [hours, minutes] = getTimeParts(time);
  const date = new Date(referenceDate);
  date.setSeconds(0, 0);
  date.setHours(hours, minutes, 0, 0);

  const diff = (dayOfWeek - date.getDay() + 7) % 7;
  if (diff === 0 && date <= referenceDate) {
    date.setDate(date.getDate() + 7);
  } else if (diff !== 0) {
    date.setDate(date.getDate() + diff);
  }

  return date;
};

export const adjustStartDateToSchedule = (
  currentStartDate: string | undefined,
  dayOfWeek: number,
  time: string
): string => {
  if (!currentStartDate) {
    return getNextOccurrence(dayOfWeek, time).toISOString();
  }

  const [hours, minutes] = getTimeParts(time);
  const date = new Date(currentStartDate);
  date.setHours(hours, minutes, 0, 0);

  const diff = (dayOfWeek - date.getDay() + 7) % 7;
  if (diff !== 0) {
    date.setDate(date.getDate() + diff);
  }

  return date.toISOString();
};

export const combineDateAndTime = (dateString: string, time: string): string => {
  const [hours, minutes] = getTimeParts(time);
  const [year, month, day] = dateString.split("-").map((num) => parseInt(num, 10));
  const date = new Date();
  if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
    date.setFullYear(year, month - 1, day);
  }
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const getStartDate = (schedule: ScheduleLike): Date => {
  if (schedule.startDate) {
    return new Date(schedule.startDate);
  }
  return getNextOccurrence(schedule.dayOfWeek, schedule.time);
};

export const getWeekDate = (schedule: ScheduleLike, weekNumber: number): Date => {
  const startDate = getStartDate(schedule);
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  return date;
};

export const formatScheduleLabel = (date: Date, includeTime = true): string => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  }).format(date);
};

