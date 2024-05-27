export const notify = async (response: any, action: string) => {
    const { data, authentication } = response;
 
    const getUser = await cds.ql.SELECT.one.from("Users").where({ ID: authentication.ID });

    const getManager = await SELECT.one.from("Users").where({ department_id: getUser.department_id, role: "manager" });
    let notify: any;
    if (action === "accepted" || action === "rejected") {
        notify = responseMessage(getManager.fullName, action, "");
        await cds.ql.INSERT.into("Notifications").entries({
            sender_ID: authentication.ID,
            receiver_ID: getUser.ID,
            message: notify,
            request_ID: data.ID,
        });
    }
    if (action === "created" || action === "updated" || action === "deleted") {
        notify = responseMessage(getUser.fullName, action, data.reason);
        await cds.ql.INSERT.into("Notifications").entries({
            sender_ID: authentication.ID,
            receiver_ID: getManager.ID,
            message: notify,
            request_ID: data.ID,
        });
        console.log("success");
        
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
                receiver_ID: authentication.ID,
            });
    } catch (error) {
        return error.message;
    }
};

const responseMessage = (name: string, action: string, reason: string): string => {
    if (action === "created" || action === "updated" || action === "deleted")
        return `${name} have just ${action} a request with the reason : ${reason}. Check it out!!!`;
    if (action === "accepted" || action === "rejected") return `${name} has ${action} your request. Check it out!!!`;
};
