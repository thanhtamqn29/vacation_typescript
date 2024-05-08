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
        role?: Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequests[];
        department?: IDepartments;
        department_id?: number;
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
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

    export interface INotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IUsers;
        sender_ID?: string;
        receiver?: IUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IRequests;
        request_ID?: string;
    }

    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUsers[];
        isActive?: boolean;
    }

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
        Users = "vacation.Users",
        Requests = "vacation.Requests",
        Notifications = "vacation.Notifications",
        Departments = "vacation.Departments",
        Calendar = "vacation.Calendar",
    }

    export enum SanitizedEntity {
        Users = "Users",
        Requests = "Requests",
        Notifications = "Notifications",
        Departments = "Departments",
        Calendar = "Calendar",
    }
}

export namespace sap.common {
    export interface ILanguages {
        name: string;
        descr: string;
        code: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ICountries {
        name: string;
        descr: string;
        code: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ICurrencies {
        name: string;
        descr: string;
        code: string;
        symbol: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export enum Entity {
        Languages = "sap.common.Languages",
        Countries = "sap.common.Countries",
        Currencies = "sap.common.Currencies",
        Texts = "sap.common.Currencies.texts",
    }

    export enum SanitizedEntity {
        Languages = "Languages",
        Countries = "Countries",
        Currencies = "Currencies",
        Texts = "Texts",
    }
}

export namespace AuthService {
    export enum FuncRefresh {
        name = "refresh",
    }

    export type FuncRefreshReturn = string;

    export enum FuncLogout {
        name = "logout",
    }

    export type FuncLogoutReturn = string;

    export enum Entity {}

    export enum SanitizedEntity {}
}

export namespace ManagerService {
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
        requests?: IRequestsManage[];
        department?: IDepartments;
        department_id?: number;
    }

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

    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUsers[];
        isActive?: boolean;
    }

    export interface IRequestsManage {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: INotifications;
    }

    export interface INotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IUsers;
        sender_ID?: string;
        receiver?: IUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IRequestsManage;
        request_ID?: string;
    }

    export enum ActionInvite {
        name = "invite",
        paramIds = "ids",
    }

    export interface IActionInviteParams {
        ids: string[];
    }

    export type ActionInviteReturn = string;

    export enum Entity {
        Users = "ManagerService.Users",
        Calendar = "ManagerService.Calendar",
        Departments = "ManagerService.Departments",
        RequestsManage = "ManagerService.RequestsManage",
        Notifications = "ManagerService.Notifications",
    }

    export enum SanitizedEntity {
        Users = "Users",
        Calendar = "Calendar",
        Departments = "Departments",
        RequestsManage = "RequestsManage",
        Notifications = "Notifications",
    }
}

export namespace PublicService {
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

    export enum Entity {
        Users = "PublicService.Users",
    }

    export enum SanitizedEntity {
        Users = "Users",
    }
}

export namespace RequestService {
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
        requests?: IRequests[];
        department?: IDepartments;
        department_id?: number;
    }

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

    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUsers[];
        isActive?: boolean;
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: INotifications;
    }

    export interface INotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IUsers;
        sender_ID?: string;
        receiver?: IUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IRequests;
        request_ID?: string;
    }

    export enum Entity {
        Users = "RequestService.Users",
        Calendar = "RequestService.Calendar",
        Departments = "RequestService.Departments",
        Requests = "RequestService.Requests",
        Notifications = "RequestService.Notifications",
    }

    export enum SanitizedEntity {
        Users = "Users",
        Calendar = "Calendar",
        Departments = "Departments",
        Requests = "Requests",
        Notifications = "Notifications",
    }
}

export type User = string;

export enum Entity {}

export enum SanitizedEntity {}
