import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';
import { slice, toString } from '../tool';

export function ExpressionStatement(env: Environment<ESTree.ExpressionStatement>) {
    return env.evaluate(env.node.expression, { extra: env.extra });
}

export function BlockStatement(env: Environment<ESTree.BlockStatement>) {
    let scope: Scope;
    if (!env.scope.invasive) {
        scope = env.createBlockScope();
    } else {
        scope = env.scope;
        scope.invasive = false;
    }

    for (const node of env.node.body) {
        if (node.type === 'FunctionDeclaration') {
            env.evaluate(node, { scope });
        } else if (node.type === 'VariableDeclaration' && node.kind === 'var') {
            for (const declarator of node.declarations) {
                scope.varDeclare((<ESTree.Identifier>declarator.id).name);
            }
        }
    }

    for (const node of env.node.body) {
        if (node.type === 'FunctionDeclaration') {
            continue;
        }

        const signal: Signal = env.evaluate(node, { scope, extra: env.extra });
        if (Signal.isSignal(signal)) {
            return signal;
        }
    }
}

export function VariableDeclaration(env: Environment<ESTree.VariableDeclaration>) {
    for (const declarator of env.node.declarations) {
        const v = declarator.init ? env.evaluate(declarator.init) : undefined;
        declarePatternValue({ node: declarator.id, v, env, scope: env.scope, kind: env.node.kind });
    }
}

export function ArrayExpression(env: Environment<ESTree.ArrayExpression>) {
    let arr: any[] = [];
    for (let element of env.node.elements) {
        if (element.type !== 'SpreadElement') {
            arr.push(env.evaluate(element));
        } else {
            arr = [...arr, ...env.evaluate(element.argument)];
        }
    }
    return arr;
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

export function FunctionExpression(env: Environment<ESTree.FunctionExpression>) {
    const node = env.node;
    const fn = function (this: any) {
        const scope = env.createFunctionScope(true);

        scope.constDeclare('this', this);
        scope.constDeclare('arguments', arguments);
        if (env.extra && env.extra.SuperClass) {
            if (env.extra.isConstructor || env.extra.isStaticMethod) {
                scope.constDeclare('@@evil-eval/super', env.extra.SuperClass);
            } else if (env.extra.isMethod) {
                scope.constDeclare('@@evil-eval/super', env.extra.SuperClass.prototype);
            }
        }

        for (let i = 0, l = node.params.length; i < l; i++) {
            const { name } = <ESTree.Identifier>node.params[i];
            scope.varDeclare(name, arguments[i]);
        }

        const signal = env.evaluate(node.body, { scope, extra: env.extra });
        if (Signal.isReturn(signal)) {
            return signal.value;
        }
    };

    Object.defineProperties(fn, {
        name: { value: node.id ? node.id.name : '' },
        length: { value: node.params.length }
    });

    return fn;
}

export function CallExpression(env: Environment<ESTree.CallExpression>) {
    const fn: Function = env.evaluate(env.node.callee);
    const args = env.node.arguments.map(it => env.evaluate(it));

    let thisValue: any;
    if (env.node.callee.type === 'MemberExpression') {
        if (env.node.callee.object.type !== 'Super') {
            thisValue = env.evaluate(env.node.callee.object);
        } else {
            const value = env.scope.get('this');
            thisValue = value.v;
        }

    } else if (env.extra && env.extra.isConstructor) {
        const value = env.scope.get('this');
        thisValue = value.v;
    }

    return fn.apply(thisValue, args);
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
    const value = env.scope.get('@@evil-eval/super');
    return value.v;
}

/**
 * see: ArrayExpression
 */
export function SpreadElement(env: Environment<ESTree.SpreadElement>) {
    throw new Error(`evil-eval: [SpreadElement] Should not happen`);
}

export function ArrowFunctionExpression(env: Environment<ESTree.ArrowFunctionExpression>) {
    const node = env.node;
    const fn = function (this: any) {
        const scope = env.createFunctionScope(true);

        for (let i = 0, l = node.params.length; i < l; i++) {
            const { name } = <ESTree.Identifier>node.params[i];
            scope.varDeclare(name, arguments[i]);
        }

        const signal = env.evaluate(node.body, { scope, extra: env.extra });
        if (Signal.isReturn(signal)) {
            return signal.value;
        }
    };

    Object.defineProperties(fn, {
        length: { value: node.params.length }
    });

    return fn;
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
    const body = env.node.body;

    const ctor = body.find(n => n.kind === 'constructor');

    let Class: Function;
    if (ctor) {
        Class = env.evaluate(ctor.value, { extra: { ...env.extra, isConstructor: true } });
    } else {
        Class = function () { }
    }

    if (env.extra && env.extra.SuperClass) {
        extends_(Class, env.extra.SuperClass);
    }

    let staticProperties: PropertyDescriptorMap = {};
    let properties: PropertyDescriptorMap = {};

    for (const node of body) {
        let key = (<ESTree.Identifier>node.key).name;
        if (node.computed) {
            const value = env.scope.get(key)
            key = value.v;
        }
        let prop: PropertyDescriptor;
        if (node.kind === 'method') {
            if (!node.static) {
                prop = properties[key];
                if (!prop || !prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.value = env.evaluate(node.value, { extra: { ...env.extra, isMethod: true } });
                properties[key] = prop;
            } else {
                prop = staticProperties[key];
                if (!prop || !prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.value = env.evaluate(node.value, { extra: { ...env.extra, isStaticMethod: true } });
                staticProperties[key] = prop;
            }

        } else if (node.kind === 'get') {
            if (!node.static) {
                prop = properties[key];
                if (!prop || prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.get = env.evaluate(node.value);
                properties[key] = prop;
            } else {
                prop = staticProperties[key];
                if (!prop || prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.get = env.evaluate(node.value);
                staticProperties[key] = prop;
            }

        } else if (node.kind === 'set') {
            if (!node.static) {
                prop = properties[key];
                if (!prop || prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.set = env.evaluate(node.value);
                properties[key] = prop;
            } else {
                prop = staticProperties[key];
                if (!prop || prop.value) {
                    prop = {
                        configurable: true,
                        enumerable: true
                    };
                }
                prop.set = env.evaluate(node.value);
                staticProperties[key] = prop;
            }
        }
    }

    Object.defineProperties(Class, staticProperties);
    Object.defineProperties(Class.prototype, properties);

    return Class;
}

/**
 * see: ClassBody
 */
export function MethodDefinition(env: Environment<ESTree.MethodDefinition>) {
    throw new Error(`evil-eval: [MethodDefinition] Should not happen`);
}

export function ClassDeclaration(env: Environment<ESTree.ClassDeclaration>) {
    const Class = ClassExpression(<any>env);
    env.scope.constDeclare(env.node.id.name, Class);
}

export function ClassExpression(env: Environment<ESTree.ClassExpression>) {
    const { node } = env;
    let SuperClass;
    if (node.superClass) {
        SuperClass = env.evaluate(node.superClass);
    }
    const Class = env.evaluate(node.body, { extra: { SuperClass } });
    if (node.id) {
        Object.defineProperty(Class, 'name', { value: node.id.name });
    }
    return Class;
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

const extendStatics = Object.setPrototypeOf
    || ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; })
    || function (Class: any, SuperClass: any) { for (var p in SuperClass) if (SuperClass.hasOwnProperty(p)) Class[p] = SuperClass[p]; };

function extends_(Class: Function, SuperClass: Function) {
    extendStatics(Class, SuperClass);

    function __(this: any) { this.constructor = Class; }

    Class.prototype = SuperClass === null
        ? Object.create(SuperClass)
        : (__.prototype = SuperClass.prototype, new (<{ new(): any; }><any>__)());
}
