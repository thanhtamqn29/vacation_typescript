export const getAllDaysBetween = (startDay : Date, endDay : Date) : Array<String> => {
    const days = [];
    let currentDate = new Date(startDay);
    for (
      let date = currentDate;
      date <= endDay;
      date.setDate(date.getDate() + 1)
    ) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${day}`);
    }
    return days;
  };