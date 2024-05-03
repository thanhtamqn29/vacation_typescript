export const recalculateVacationDays = async () => {
    try {
        const allUsers = await cds.ql.SELECT.from("Users");
        for (const user of allUsers) {
          let dayOffThisYear = user.dayOffThisYear;
          let dayOffLastYear = user.dayOffLastYear;
          if (dayOffThisYear === 0) {
            dayOffLastYear = 0;
            dayOffThisYear = 12 * 1.25;
          } else if (dayOffThisYear > 0 && dayOffThisYear <= 5) {
            dayOffLastYear = dayOffThisYear;
            dayOffThisYear = 12 * 1.25;
          } else if (dayOffThisYear > 5) {
            dayOffLastYear = 5;
            dayOffThisYear = 12 * 1.25;
          }
          await cds.ql.UPDATE("Users")
            .set({ dayOffThisYear, dayOffLastYear })
            .where({ ID: user.ID });
  
        }
      } catch (error) {
        return { status: 500, message: error.message };
      }
}

export const refreshDayOffLastYear = async () => {
    try {
        const allUsers = await cds.ql.SELECT.from("Users");
        for (const user of allUsers) {
          await cds.ql.UPDATE("Users").set({ dayOffLastYear: 0 }).where({ ID: user.ID });
        }
      } catch (error) {
        return { status: 500, message: error };
      }
}

export const calculateVacationDays = async (user_id : string) => {
    try {
      const user = await cds.ql.SELECT.one.from("Users").where({ ID: user_id });
      const createdAt = new Date(user.createdAt);
      const currentYear = new Date().getFullYear();
      if (createdAt.getFullYear() === currentYear) {
        const endOfYear = new Date(currentYear, 11, 31);
        const monthsPassed = endOfYear.getMonth() - createdAt.getMonth();
        const dayOffThisYear = monthsPassed * 1.25;
        await cds.ql.UPDATE("Users")
          .set({ dayOffThisYear: dayOffThisYear })
          .where({ ID: user_id });
      }
    } catch (error) {
      return { code: 500, message: error.message || "Internal Server Error" };
    }
  };

  export const getAllDaysBetween = (startDay, endDay) => {
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
  
    const weekDays = days.filter((day) => {
      const date = new Date(day);
      const dayOfWeek = date.getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6;
    });
    return weekDays;
  };
  
  export const getDaysBeforeAfterApril = (offDays: Array<string>) => {
    let daysBeforeApril = 0;
    let daysAfterApril = 0;
    const startDay = new Date(offDays[0] + "T00:00:00Z");
    const endDay = new Date(offDays[offDays.length - 1] + "T23:59:59Z");
  
    for (let date = startDay; date <= endDay; date.setDate(date.getDate() + 1)) {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        if (date.getMonth() < 3) {
          daysBeforeApril++;
        } else if (date.getMonth() === 3) {
          daysAfterApril++;
        } else {
          daysAfterApril++;
        }
      }
    }
    return { daysBeforeApril, daysAfterApril };
  };

  export const removeHolidays = async (offDays: Array<string>) => {
    const getHoliday = await SELECT.from("Calendar").where({
      startDay: { between: offDays[0], and: offDays[offDays.length - 1] },
      and: {
        endDay: { between: offDays[0], and: offDays[offDays.length - 1] },
      },
    });
    let totalHoliday = [];
    getHoliday.map((holiday) => {
      let endDay = new Date(holiday.endDay + "T23:59:59Z");
      let startDay = new Date(holiday.startDay + "T00:00:00Z");
      const holidayTerm = getAllDaysBetween(startDay, endDay);
      totalHoliday.push(...holidayTerm);
    });
    offDays = offDays.filter((day) => !totalHoliday.includes(day));
  
    return offDays;
  };