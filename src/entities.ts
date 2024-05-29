export namespace vacation {
    export enum Role {
        staff,
        manager,
    }

    export enum Status {
        pending,
        accepted,
        rejected,
        approved,
        removed,
    }

    export enum Shift {
        M,
        A,
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
        status?: boolean;
        address: string;
        role?: Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequests[];
        department?: IDepartments;
        department_id?: number;
    }

    export enum RequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
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
        dayOffType: RequestsDayOffType;
        shift?: Shift;
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

export namespace auth.AuthService {
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

export namespace epl.EmployeeService {
    export interface IEplUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        status?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IEplRequests[];
        department?: IEplDepartments;
        department_id?: number;
    }

    export interface IEplCalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export interface IEplDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IEplUsers[];
        isActive?: boolean;
    }

    export enum EplRequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export interface IEplRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IEplUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: EplRequestsDayOffType;
        shift?: vacation.Shift;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: IEplNotifications;
    }

    export interface IEplNotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IEplUsers;
        sender_ID?: string;
        receiver?: IEplUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IEplRequests;
        request_ID?: string;
    }

    export enum Entity {
        EplUsers = "epl.EmployeeService.EplUsers",
        EplCalendar = "epl.EmployeeService.EplCalendar",
        EplDepartments = "epl.EmployeeService.EplDepartments",
        EplRequests = "epl.EmployeeService.EplRequests",
        EplNotifications = "epl.EmployeeService.EplNotifications",
    }

    export enum SanitizedEntity {
        EplUsers = "EplUsers",
        EplCalendar = "EplCalendar",
        EplDepartments = "EplDepartments",
        EplRequests = "EplRequests",
        EplNotifications = "EplNotifications",
    }
}

export namespace HrManagerService {
    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: vacation.IUsers[];
        isActive?: boolean;
    }

    export enum UserRequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export interface IUserRequests {
        request_ID: string;
        request_status?: vacation.Status;
        user_ID: string;
        username: string;
        role?: vacation.Role;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        startDay: Date;
        endDay: Date;
        reason: string;
        comment?: string;
        dayOffType: UserRequestsDayOffType;
        shift?: vacation.Shift;
        isOutOfDay?: boolean;
    }

    export enum FuncExportExcel {
        name = "exportExcel",
    }

    export type FuncExportExcelReturn = string;

    export enum Entity {
        Departments = "HrManagerService.Departments",
        UserRequests = "HrManagerService.UserRequests",
    }

    export enum SanitizedEntity {
        Departments = "Departments",
        UserRequests = "UserRequests",
    }
}

export namespace mng.ManagerService {
    export interface IMngUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        status?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IMngRequests[];
        department?: IMngDepartments;
        department_id?: number;
    }

    export interface IMngCalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export interface IMngDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IMngUsers[];
        isActive?: boolean;
    }

    export enum MngRequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export interface IMngRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IMngUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: MngRequestsDayOffType;
        shift?: vacation.Shift;
        isOutOfDay?: boolean;
        comment?: string;
        notification?: IMngNotifications;
    }

    export interface IMngNotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IMngUsers;
        sender_ID?: string;
        receiver?: IMngUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IMngRequests;
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

    export enum ActionCreateDepartment {
        name = "createDepartment",
        paramDepartmentName = "departmentName",
    }

    export interface IActionCreateDepartmentParams {
        departmentName: string;
    }

    export type ActionCreateDepartmentReturn = string;

    export enum Entity {
        MngUsers = "mng.ManagerService.MngUsers",
        MngCalendar = "mng.ManagerService.MngCalendar",
        MngDepartments = "mng.ManagerService.MngDepartments",
        MngRequests = "mng.ManagerService.MngRequests",
        MngNotifications = "mng.ManagerService.MngNotifications",
    }

    export enum SanitizedEntity {
        MngUsers = "MngUsers",
        MngCalendar = "MngCalendar",
        MngDepartments = "MngDepartments",
        MngRequests = "MngRequests",
        MngNotifications = "MngNotifications",
    }
}

export namespace pbl.PublicService {
    export interface IPblUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        status?: boolean;
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

    export enum Entity {
        PblUsers = "pbl.PublicService.PblUsers",
    }

    export enum SanitizedEntity {
        PblUsers = "PblUsers",
    }
}

export type User = string;

export enum Entity {}

export enum SanitizedEntity {}
