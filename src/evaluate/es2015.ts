import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';
import { slice } from '../tool';

export function VariableDeclaration(env: Environment<ESTree.VariableDeclaration>) {
    for (const declarator of env.node.declarations) {
        const v = declarator.init ? env.evaluate(declarator.init) : undefined;
        declarePatternValue({ node: declarator.id, v, env, scope: env.scope, kind: env.node.kind });
    }
}

export function ObjectExpression(env: Environment<ESTree.ObjectExpression>) {
    const obj: { [key: string]: any } = {};

    for (const prop of env.node.properties) {
        let key: string;
        if (!prop.computed) {
            if (prop.key.type === 'Identifier') {
                key = prop.key.name;
            } else {
                key = (<ESTree.Literal>prop.key).value as string;
            }

        } else {
            if (prop.key.type === 'Identifier') {
                const value = env.scope.get(prop.key.name);
                key = value.v;
            } else {
                key = env.evaluate(prop.key);
            }
        }

        const value = env.evaluate(prop.value);
        if (prop.kind === 'init') {
            obj[key] = value;
        } else if (prop.kind === 'get') {
            Object.defineProperty(obj, key, { get: value });
        } else if (prop.kind === 'set') {
            Object.defineProperty(obj, key, { set: value });
        } else {
            throw new Error(`evil-eval: [ObjectExpression] Unsupported property kind "${prop.kind}"`);
        }
    }

    return obj;
}

// -- es2015 new feature --

export function ForOfStatement(env: Environment<ESTree.ForOfStatement>) {
    const { left, right, body } = env.node;
    let scope = env.scope;

    for (const v of env.evaluate(right)) {
        if (left.type === 'VariableDeclaration') {
            if (left.kind === 'let' || left.kind === 'const') {
                scope = env.createBlockScope(true);
            }

            const id = left.declarations[0].id;
            // for (let it of list);
            // for (let { id } of list);
            declarePatternValue({ node: id, v, env, scope, kind: left.kind });

        } else {
            // for (it of list);
            // for ({ id } of list);
            declarePatternValue({ node: left, v, env, scope });
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

// -- private --

interface DeclarePatternValueOptions<T> {
    node: T;
    v: any;
    env: Environment<ESTree.Node>;
    scope: Scope;
    kind?: 'var' | 'let' | 'const';
}

function declarePatternValue(options: DeclarePatternValueOptions<ESTree.Pattern>) {
    if (options.node.type === 'Identifier') {
        if (options.kind) {
            options.scope.declare(options.node.name, options.v, options.kind);
        } else {
            const value = options.scope.get(options.node.name, true);
            value.v = options.v;
        }
    } else if (options.node.type === 'ObjectPattern') {
        declareObjectPatternValue(<DeclarePatternValueOptions<ESTree.ObjectPattern>>options);
    } else if (options.node.type === 'ArrayPattern') {
        declareArrayPatternValue(<DeclarePatternValueOptions<ESTree.ArrayPattern>>options);
    } else {
        throw new Error(`evil-eval: Not support to declare pattern value of node type "${options.node.type}"`);
    }
}

function declareObjectPatternValue({ node, v: vObj, env, scope, kind }: DeclarePatternValueOptions<ESTree.ObjectPattern>) {
    for (const prop of node.properties) {
        let key: string;
        if (!prop.computed) {
            if (prop.key.type === 'Identifier') {
                key = prop.key.name;
            } else {
                key = (<ESTree.Literal>prop.key).value as string;
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
            declarePatternValue({ node: prop.value, v, env, scope, kind });
        }
    }
}

function declareArrayPatternValue({ node, v: vArr, env, scope, kind }: DeclarePatternValueOptions<ESTree.ArrayPattern>) {
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
            declarePatternValue({ node: element, v, env, scope, kind });
        }
    }
}
