export class Collection<T> {
    public set: T[];
    public totalCount: number;

    constructor(set: T[], totalCount: number) {
        this.set = set;
        this.totalCount = totalCount;
    }
}