import { Permission } from './permission';
import { Organization } from '../organizations/organization';

export class User {
    public firstName: string;
    public lastName: string;
    public _id: string;
    public mail: string;
    public organization: Organization;
    public permissions: [{ organization: Organization, organizationPermissions: Permission[] }];
    public isAdmin: boolean;
    public phoneNumber: string;
    public routeGroups?: {
        general: { id: number, resource: string, title: string, route: string, searchable: boolean, icon: string }[];
        requests_for: { id: number, resource: string, title: string, route: string, searchable: boolean, icon: string }[];
    }

    public get name(): string {
        return this.firstName + ' ' + this.lastName;
    }
}
