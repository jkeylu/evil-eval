export type VariableDeclarationKind = 'var' | 'let' | 'const';

enum ValueType {
    simple,
    member
}

export interface Value {
    v: any;
}

export class SimpleValue implements Value {
    get v() {
        return this.value;
    }

    set v(value: any) {
        if (this.kind === 'const') {
            throw new TypeError('Assignment to constant variable');
        } else {
            this.value = value;
        }
    }

    constructor(
        private value: any,
        private kind: VariableDeclarationKind
    ) { }
}

export class MemberValue implements Value {
    get v() {
        return this.obj[this.name];
    }

    set v(value) {
        this.obj[this.name] = value;
    }

    constructor(
        private obj: any,
        private name: string
    ) { }
}

export function createSimpleValue(value: any, kind: VariableDeclarationKind = 'var') {
    return new SimpleValue(value, kind);
}

export function createMemberValue(obj: object, propertyName: string) {
    return new MemberValue(obj, propertyName);
}
