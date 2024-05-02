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