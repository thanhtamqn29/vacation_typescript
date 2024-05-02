export namespace sap.common {
    export interface ICodeList {
        name: string;
        descr: string;
    }

    export interface ICountries extends sap.common.ICodeList {
        code: string;
    }

    export interface ICurrencies extends sap.common.ICodeList {
        code: string;
        symbol: string;
    }

    export interface ILanguages extends sap.common.ICodeList {
        code: string;
    }

    export enum Entity {
        CodeList = "sap.common.CodeList",
        Countries = "sap.common.Countries",
        Currencies = "sap.common.Currencies",
        Languages = "sap.common.Languages",
    }

    export enum SanitizedEntity {
        CodeList = "CodeList",
        Countries = "Countries",
        Currencies = "Currencies",
        Languages = "Languages",
    }
}

export namespace vacation {
    export enum Role {
        staff,
        manager,
    }

    export enum Status {
        pending,
        accepted,
        rejected,
    }

    export interface ICalendar extends ICuid, IManaged {
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export interface IDepartments extends IManaged {
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUsers[];
        isActive?: boolean;
    }

    export interface INotifications extends ICuid, IManaged {
        sender?: IUsers;
        sender_ID?: string;
        receiver?: IUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IRequests;
        request_ID?: string;
    }

    export interface IRequests extends ICuid, IManaged {
        status?: Status;
        reason: string;
        user?: IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: INotifications;
    }

    export interface IUsers extends ICuid, IManaged {
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequests[];
        department?: IDepartments;
        department_id?: number;
    }

    export enum Entity {
        Calendar = "vacation.Calendar",
        Departments = "vacation.Departments",
        Notifications = "vacation.Notifications",
        Requests = "vacation.Requests",
        Users = "vacation.Users",
    }

    export enum SanitizedEntity {
        Calendar = "Calendar",
        Departments = "Departments",
        Notifications = "Notifications",
        Requests = "Requests",
        Users = "Users",
    }
}

export namespace AuthService {
    export interface IUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: vacation.IRequests[];
        department?: vacation.IDepartments;
        department_id?: number;
    }

    export enum ActionLogin {
        name = "login",
        paramUsername = "username",
        paramPassword = "password",
    }

    export interface IActionLoginParams {
        username: string;
        password: string;
    }

    export type ActionLoginReturn = string;

    export enum FuncLogout {
        name = "logout",
    }

    export type FuncLogoutReturn = string;

    export enum FuncRefresh {
        name = "refresh",
    }

    export type FuncRefreshReturn = string;

    export enum Entity {
        Users = "AuthService.Users",
    }

    export enum SanitizedEntity {
        Users = "Users",
    }
}

export namespace ManagerService {
    export interface ICalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export enum Entity {
        Calendar = "ManagerService.Calendar",
    }

    export enum SanitizedEntity {
        Calendar = "Calendar",
    }
}

export namespace RequestService {
    export interface ICalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: vacation.IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: vacation.INotifications;
    }

    export enum Entity {
        Calendar = "RequestService.Calendar",
        Requests = "RequestService.Requests",
    }

    export enum SanitizedEntity {
        Calendar = "Calendar",
        Requests = "Requests",
    }
}

export type User = string;

export interface ICuid {
    ID: string;
}

export interface IManaged {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
}

export interface ITemporal {
    validFrom: Date;
    validTo: Date;
}

export enum Entity {
    Cuid = "cuid",
    Managed = "managed",
    Temporal = "temporal",
}

export enum SanitizedEntity {
    Cuid = "Cuid",
    Managed = "Managed",
    Temporal = "Temporal",
}
