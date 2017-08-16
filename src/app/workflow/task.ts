import { Organization } from '../organizations/organization';
import { User } from "app/users/user";
import { Observable } from "rxjs/Observable";

export class Task {
    public type: TaskType;
    public order: number;
    public organization: Organization;
    public status: TaskStatus;
    public authorizer: User;
    public lastChangeDate: Date;
    public canEdit: boolean;
    public needEscort: boolean;
    public needTag: boolean;
    public securityClearance: number;
    public confirmationNumber: number;
}

export enum TaskType {
    HUMAN = <any>'HUMAN',
    CAR = <any>'CAR'
}

export enum TaskStatus {
    PENDING = <any>'PENDING',
    APPROVED = <any>'APPROVED',
    DENIED = <any>'DENIED'
}