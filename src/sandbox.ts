import { Value, createMemberValue } from './value';

const hop = Object.prototype.hasOwnProperty;

export default class Sandbox {
    constructor(private sandbox: { [key: string]: any }) { }

    get(name: string, autoDeclare = false): Value | undefined {
        if (autoDeclare || hop.call(this.sandbox, name)) {
            return createMemberValue(this.sandbox, name);
        }
    }

    declare(name: string, value?: any) {
        this.sandbox[name] = value;
    }
}
