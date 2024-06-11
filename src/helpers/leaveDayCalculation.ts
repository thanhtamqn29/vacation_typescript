import { vacation } from "../entities";

export const recalculateLeaveDays = async () => {
    // at 23:59:59 on the last day of Dec

    const allUsers = await cds.ql.SELECT.from(vacation.Entity.Users);
    for (const user of allUsers) {
        let dayOffThisYear = user.dayOffThisYear ?? 0;
        let dayOffLastYear = user.dayOffLastYear ?? 0;

        if (dayOffThisYear <= 0) {
            dayOffLastYear = 0;
        } else if (dayOffThisYear > 5) {
            dayOffLastYear = 5;
        } else {
            dayOffLastYear = dayOffThisYear;
        }

        await cds.ql.UPDATE(vacation.Entity.Users).set({ dayOffThisYear: 0, dayOffLastYear }).where({ ID: user.ID });
    }
};

export const refreshDayOffLastYear = async () => {
    // at 23:59:59 on the last day of March

    const allUsers = await cds.ql.SELECT.from(vacation.Entity.Users);
    const currentYear = new Date().getFullYear();

    for (const user of allUsers) {
        const startYear = new Date(user.createdAt).getFullYear();
        if (startYear < currentYear) {
            await cds.ql.UPDATE(vacation.Entity.Users).set({ dayOffLastYear: 0 }).where({ ID: user.ID });
        }
    }
};

export const addLeaveDay = async () => {
    // at 23:59:59 on the last day of the month

    const allUsers = await cds.ql.SELECT.from(vacation.Entity.Users);
    for (const user of allUsers) {
        const increment = user.dayOffThisYear <= 0 ? 1.25 : { "+=": 1.25 };

        await cds.ql.UPDATE(vacation.Entity.Users).set({ dayOffThisYear: increment }).where({ ID: user.ID });
    }
};

export const calculateVacationDays = async user_id => {
    try {
        const user = await cds.ql.SELECT.one.from(vacation.Entity.Users).where({ ID: user_id });
        const createdAt = new Date(user.createdAt);
        const currentYear = new Date().getFullYear();

        if (createdAt.getFullYear() === currentYear) {
            const endOfYear = new Date(currentYear, 11, 31);
            const monthsPassed = endOfYear.getMonth() - createdAt.getMonth();
            const dayOffThisYear = monthsPassed * 1.25;

            await cds.ql.UPDATE(vacation.Entity.Users).set({ dayOffThisYear }).where({ ID: user_id });
        }
    } catch (error) {
        return { code: 500, message: error.message || "Internal Server Error" };
    }
};

export const executeDecreaseLeaveDay = async () => {
    const currentMonth = new Date().getMonth() + 1;

    const requests = await cds.ql.SELECT.from(vacation.Entity.Requests).where({ status: { "=": "accepted" } });

    for (const request of requests) {
        const startDay = new Date(request.startDay + "T00:00:00Z");
        if (startDay.getMonth() + 1 === currentMonth) {
            const [user] = await cds.ql.SELECT.from(vacation.Entity.Users).where({ ID: request.user_ID });
            let endDay = new Date(request.endDay + "T23:59:59Z");
            let startDay = new Date(request.startDay + "T00:00:00Z");

            const removeWeekend = getAllDaysBetween(startDay, endDay);
            const removeHoliday = await removeHolidays(removeWeekend);

            startDay = new Date(request.startDay + "T00:00:00Z");
            endDay = new Date(request.endDay + "T23:59:59Z");

            const startDayMonth = startDay.getMonth();
            const endDayMonth = endDay.getMonth();

            if (request.shift) {
                if (!user.dayOffLastYear) {
                    await cds.ql
                        .UPDATE(vacation.Entity.Users)
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffThisYear: { "-=": 0.5 },
                        });
                } else {
                    if (startDayMonth < 3) {
                        await cds.ql
                            .UPDATE(vacation.Entity.Users)
                            .set({ dayOffLastYear: { "-=": 0.5 } })
                            .where({ ID: user.ID });
                    }
                    if (startDayMonth > 3) {
                        await cds.ql
                            .UPDATE(vacation.Entity.Users)
                            .set({ dayOffThisYear: { "-=": 0.5 } })
                            .where({ ID: user.ID });
                    }
                }
            }
            if (request.endDay) {
                if (!user.dayOffLastYear) {
                    await cds.ql
                        .UPDATE(vacation.Entity.Users)
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffThisYear: { "-=": removeHoliday.length },
                        });
                } else {
                    if (startDayMonth < 3 && endDayMonth == 3) {
                        const { daysBeforeApril, daysAfterApril } = getDaysBeforeAfterApril(removeHoliday);
                        const newDayOffLastYear = user.dayOffLastYear - daysBeforeApril;

                        await cds.ql
                            .UPDATE(vacation.Entity.Users)
                            .set({ dayOffThisYear: { "-=": daysAfterApril } })
                            .where({ ID: user.ID });

                        if (newDayOffLastYear >= 0)
                            await cds.ql.UPDATE(vacation.Entity.Users).set({ dayOffLastYear: newDayOffLastYear }).where({ ID: user.ID });

                        if (newDayOffLastYear < 0)
                            await cds.ql
                                .UPDATE(vacation.Entity.Users)
                                .set({
                                    dayOffLastYear: 0,
                                    dayOffThisYear: { "+=": newDayOffLastYear },
                                })
                                .where({ ID: user.ID });
                    } else {
                        const newDayOffLastYear = user.dayOffLastYear - removeHoliday.length;

                        if (newDayOffLastYear >= 0)
                            await cds.ql
                                .UPDATE(vacation.Entity.Users)
                                .set({ dayOffLastYear: { "-=": removeHoliday.length } })
                                .where({ ID: user.ID });

                        if (newDayOffLastYear < 0)
                            await cds.ql
                                .UPDATE(vacation.Entity.Users)
                                .set({
                                    dayOffLastYear: 0,
                                    dayOffThisYear: { "+=": newDayOffLastYear },
                                })
                                .where({ ID: user.ID });
                    }
                }
            }
            await cds.ql.UPDATE(vacation.Entity.Requests).set({ status: "approved" }).where({ user_ID: user.ID });
        }
    }
};

export const getAllDaysBetween = (startDay, endDay) => {
    const days = [];
    let currentDate = new Date(startDay);
    const currentMonth = new Date().getMonth() + 1;

    while (currentDate <= endDay) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        // Check if the month of the current date is equal to the current month
        if (currentDate.getMonth() + 1 === currentMonth) {
            days.push(formattedDate);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Filter out weekend days
    const weekDays = days.filter(day => {
        const date = new Date(day);
        const dayOfWeek = date.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0 = Sunday, 6 = Saturday
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
    const getHoliday = await SELECT.from(vacation.Entity.Calendar).where({
        startDay: { between: offDays[0], and: offDays[offDays.length - 1] },
        and: {
            endDay: { between: offDays[0], and: offDays[offDays.length - 1] },
        },
    });
    let totalHoliday = [];
    getHoliday.map(holiday => {
        let endDay = new Date(holiday.endDay + "T23:59:59Z");
        let startDay = new Date(holiday.startDay + "T00:00:00Z");
        const holidayTerm = getAllDaysBetween(startDay, endDay);
        totalHoliday.push(...holidayTerm);
    });
    offDays = offDays.filter(day => !totalHoliday.includes(day));

    return offDays;
};
export const filterDaysInCurrentMonth = async days => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return days.filter(day => {
        const month = new Date(day).getMonth() + 1;
        const year = new Date(day).getFullYear();
        return month === currentMonth && year === currentYear;
    });
};
