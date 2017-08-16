import { Visitor } from '../visitors/visitor';
import { User } from '../users/user';
import { Organization } from '../organizations/organization';
import { Task, TaskStatus } from "app/workflow/task";

export class Request {
    public isSoldier: boolean;
    public _id?: any;
    public startDate: Date;
    public endDate: Date;
    public requestDate: Date;
    public description?: string;
    public hasCar: boolean;
    public car: CarType;
    public needEscort: boolean;
    public requestor: User;
    public authorizer?: User;
    public visitor: Visitor;
    public status?: TaskStatus;
    public phoneNumber: string;
    public organization: Organization;
    public carNumber?: number;
    public workflow?: Task[];
    public type: string;
    public rank?: string;
}

export enum CarType {
    NONE = <any>"NONE",
    PRIVATE = <any>"PRIVATE",
    ay = <any>"ay"
}
