import { Task } from './../workflow/task';

export class Organization {
    public _id: any;
    public name: string;
    public workflow?: Task[]
    public tags?: { _id: string }[]
    constructor(name: string) {
        this.name = name;
    }

}
