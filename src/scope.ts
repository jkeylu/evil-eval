import * as ESTree from 'estree';
import { Value, VariableDeclarationKind, createSimpleValue } from './value';
import Sandbox from './sandbox';

export type ScopeType = 'block' | 'function';

export default class Scope {
    invasive = false;
    type: ScopeType;
    outer?: Scope;
    declaration: { [name: string]: Value } = Object.create(null);
    sandbox?: Sandbox; // should be assigned at root scope

    constructor(type: ScopeType, outer?: Scope) {
        this.type = type;
        this.outer = outer;
    }

    get(name: string, autoDeclare = false): Value {
        if (this.declaration[name]) {
            return this.declaration[name];
        } else if (this.outer) {
            return this.outer.get(name, autoDeclare);
        } else {
            const value = this.sandbox!.get(name, autoDeclare);
            if (value) {
                return value;
            }
        }

        throw new ReferenceError(`${name} is not defined`);
    }

    declare(name: string, value: any, kind: VariableDeclarationKind = 'var') {
        if (kind === 'var') {
            return this.varDeclare(name, value);

        } else if (kind === 'let') {
            return this.letDeclare(name, value);

        } else if (kind === 'const') {
            return this.constDeclare(name, value);

        } else {
            throw new Error();
        }
    }

    varDeclare(name: string, value?: any) {
        let scope: Scope = this;
        while (scope.outer && scope.type !== 'function') {
            scope = scope.outer;
        }
        this.declaration[name] = createSimpleValue(value, 'var');
        return this.declaration[name];
    }

    letDeclare(name: string, value?: any) {
        if (this.declaration[name]) {
            throw new SyntaxError(`Identifier '${name}' has already been declared`);
        }
        this.declaration[name] = createSimpleValue(value, 'let');
        return this.declaration[name];
    }

    constDeclare(name: string, value: any, override = false) {
        if (!override && this.declaration[name]) {
            throw new SyntaxError(`Identifier '${name}' has already been declared`);
        }
        this.declaration[name] = createSimpleValue(value, 'const');
        return this.declaration[name];
    }
}
