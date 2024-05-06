export const notify = async (response: any, action: string) => {
    const { data, authentication } = response;
    const getUser = await cds.ql.SELECT.one.from("Users").where({ ID: data.user_ID });

    const getManager = await cds.ql.SELECT.one.from("Users").where({ department_id: getUser.department_id, role: "manager" });
    let notify;
    if (action === "accepted" || action === "rejected") {
        notify = responseMessage(getManager.fullName, action, "");
        await INSERT.into("Notifications").entries({
            sender_ID: authentication.id,
            receiver_ID: getUser.ID,
            message: notify,
            request_ID: data.ID,
        });
    }
    if (action === "new" || action === "update" || action === "delete") {
        notify = responseMessage(getUser.fullName, action, data.reason);
        await INSERT.into("Notifications").entries({
            sender_ID: authentication.id,
            receiver_ID: getManager.ID,
            message: notify,
            request_ID: data.ID,
        });
    }
};

export const flaggedNotification = async (response: any, authentication: any) => {

    try {
        await cds.ql
        .UPDATE("Notifications")
        .set({
            isRead: true,
        })
        .where({
            ID: response.ID,
            receiver_ID: authentication.id,
        });

    } catch (error) {
        return error.message
    }
      
      
    
};

const responseMessage = (name: string, action: string, reason: string): string => {
    if (action === "new" || action === "update" || action === "delete")
        return `${name} has just sent you a(n) ${action} request with the reason : ${reason}. Check it out!!!`;
    if (action === "accepted" || action === "rejected") return `${name} has ${action} your request. Check it out!!!`;
};
