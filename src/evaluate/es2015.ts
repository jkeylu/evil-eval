import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';
import { slice } from '../tool';

export function ObjectExpression(env: Environment<ESTree.ObjectExpression>) {
    const obj: { [key: string]: any } = {};

    for (const property of env.node.properties) {
        let key: string;
        if (!property.computed) {
            if (property.key.type === 'Literal') {
                key = property.key.value as string;
            } else if (property.key.type === 'Identifier') {
                key = property.key.name;
            } else {
                throw new Error(`evil-eval: [ObjectExpression] Unsupported property key type "${property.key.type}"`);
            }
        } else {
            if (property.key.type === 'Identifier') {
                const value = env.scope.get(property.key.name);
                key = value.v;
            } else {
                key = env.evaluate(property.key);
            }
        }

        const value = env.evaluate(property.value);
        if (property.kind === 'init') {
            obj[key] = value;
        } else if (property.kind === 'get') {
            Object.defineProperty(obj, key, { get: value });
        } else if (property.kind === 'set') {
            Object.defineProperty(obj, key, { set: value });
        } else {
            throw new Error(`evil-eval: [ObjectExpression] Unsupported property kind "${property.kind}"`);
        }
    }

    return obj;
}

interface AssignPatternValueOptions<T> {
    node: T;
    v: any;
    env: Environment<ESTree.Node>;
    scope: Scope;
    kind?: 'var' | 'let' | 'const';
}

function assignPatternValue(options: AssignPatternValueOptions<ESTree.Pattern>) {
    if (options.node.type === 'ObjectPattern') {
        assignObjectPatternValue(<AssignPatternValueOptions<ESTree.ObjectPattern>>options);
    } else if (options.node.type === 'ArrayPattern') {
        assignArrayPatternValue(<AssignPatternValueOptions<ESTree.ArrayPattern>>options);
    } else {
        throw new Error(`evil-eval`);
    }
}
function assignObjectPatternValue({ node, v: vObj, env, scope, kind }: AssignPatternValueOptions<ESTree.ObjectPattern>) {
    for (const prop of node.properties) {
        let key: string;
        if (!prop.computed) {
            if (prop.key.type === 'Literal') {
                key = prop.key.value as string;
            } else {
                key = (<ESTree.Identifier>prop.key).name;
            }
        } else {
            key = env.evaluate(prop.key);
        }

        const v = vObj[key];

        if (prop.value.type === 'Identifier') {
            if (v === null || v === undefined) {
                throw new TypeError(`Cannot destructure property \`${key}\` of 'undefined' or 'null'.`)
            }
            if (kind) {
                scope.declare(prop.value.name, v, kind);
            } else {
                const value = scope.get(prop.value.name, true);
                value.v = v;
            }
        } else {
            assignPatternValue({ node: prop.value, v, env, scope, kind });
        }
    }
}

function assignArrayPatternValue({ node, v: vArr, env, scope, kind }: AssignPatternValueOptions<ESTree.ArrayPattern>) {
    for (let i = 0, l = node.elements.length; i < l; i++) {
        const element = node.elements[i];

        let v = vArr[i];
        if (element.type === 'Identifier') {
            if (v === undefined) {
                throw new TypeError(`Cannot read property 'Symbol(Symbol.iterator)' of undefined`);
            } else if (v === null) {
                throw new TypeError(`Cannot read property 'Symbol(Symbol.iterator)' of object`);
            }
            if (kind) {
                scope.declare(element.name, v, kind);
            } else {
                const value = scope.get(element.name, true);
                value.v = v;
            }
        } else if (element.type === 'RestElement') {
            const name = (<ESTree.Identifier>element.argument).name;
            v = slice.call(vArr, i);
            if (kind) {
                scope.declare(name, v, kind);
            } else {
                const value = scope.get(name, true);
                value.v = v;
            }
        } else {
            assignPatternValue({ node: element, v, env, scope, kind });
        }
    }
}

export function ForOfStatement(env: Environment<ESTree.ForOfStatement>) {
    const { left, right, body } = env.node;
    let scope = env.scope;

    for (const v of env.evaluate(right)) {
        if (left.type === 'VariableDeclaration') {
            if (left.kind === 'let' || left.kind === 'const') {
                scope = env.createBlockScope(true);
            }

            const id = left.declarations[0].id;
            if (id.type === 'Identifier') {
                // for (let it of list);
                scope.declare(id.name, v, left.kind);
            } else {
                // for (let { id } of list);
                assignPatternValue({ node: id, v, env, scope, kind: left.kind });
            }

        } else {
            if (left.type === 'Identifier') {
                // for (if of list);
                const value = scope.get(left.name, true);
                value.v = v;
            } else {
                // for ({ id } of list);
                assignPatternValue({ node: left, v, env, scope });
            }
        }

        const signal: Signal = env.evaluate(body, { scope });

        if (Signal.isSignal(signal)) {
            if (Signal.isBreak(signal)) {
                if (!signal.value || signal.value === env.label) break;
            } else if (Signal.isContinue(signal)) {
                if (!signal.value || signal.value === env.label) continue;
            }
            return signal;
        }
    }
}

export function Super(env: Environment<ESTree.Super>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function SpreadElement(env: Environment<ESTree.SpreadElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ArrowFunctionExpression(env: Environment<ESTree.ArrowFunctionExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function YieldExpression(env: Environment<ESTree.YieldExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TemplateLiteral(env: Environment<ESTree.TemplateLiteral>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TaggedTemplateExpression(env: Environment<ESTree.TaggedTemplateExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TemplateElement(env: Environment<ESTree.TemplateElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ObjectPattern(env: Environment<ESTree.ObjectPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ArrayPattern(env: Environment<ESTree.ArrayPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function RestElement(env: Environment<ESTree.RestElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function AssignmentPattern(env: Environment<ESTree.AssignmentPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassBody(env: Environment<ESTree.ClassBody>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function MethodDefinition(env: Environment<ESTree.MethodDefinition>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassDeclaration(env: Environment<ESTree.ClassDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassExpression(env: Environment<ESTree.ClassExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function MetaProperty(env: Environment<ESTree.MetaProperty>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportDeclaration(env: Environment<ESTree.ImportDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportSpecifier(env: Environment<ESTree.ImportSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportDefaultSpecifier(env: Environment<ESTree.ImportDefaultSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportNamespaceSpecifier(env: Environment<ESTree.ImportNamespaceSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportNamedDeclaration(env: Environment<ESTree.ExportNamedDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportSpecifier(env: Environment<ESTree.ExportSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportDefaultDeclaration(env: Environment<ESTree.ExportDefaultDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportAllDeclaration(env: Environment<ESTree.ExportAllDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}
