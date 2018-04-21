import * as ESTree from 'estree';
import Scope from '../scope';
import { Value, createMemberValue } from '../value';
import Signal from '../signal';
import Environment from '../environment';
import * as Tool from '../tool';

export function Identifier(env: Environment<ESTree.Identifier>) {
    if (env.node.name === 'undefined') {
        return undefined;
    }

    return env.scope.get(env.node.name).v;
}

export function Literal(env: Environment<ESTree.Literal>) {
    return env.node.value;
}

export function Program(env: Environment<ESTree.Program>) {
    for (const node of env.node.body) {
        env.evaluate(node);
    }
}

export function ExpressionStatement(env: Environment<ESTree.ExpressionStatement>) {
    return env.evaluate(env.node.expression);
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

        const signal: Signal = env.evaluate(node, { scope });
        if (Signal.isSignal(signal)) {
            return signal;
        }
    }
}

export function EmptyStatement(env: Environment<ESTree.EmptyStatement>) { }

export function DebuggerStatement(env: Environment<ESTree.DebuggerStatement>) {
    debugger;
}

export function WithStatement(env: Environment<ESTree.WithStatement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ReturnStatement(env: Environment<ESTree.ReturnStatement>) {
    let value: any;
    if (env.node.argument) {
        value = env.evaluate(env.node.argument);
    }
    return Signal.Return(value);
}

export function LabeledStatement(env: Environment<ESTree.LabeledStatement>) {
    return env.evaluate(env.node.body, { label: env.node.label.name });
}

export function BreakStatement(env: Environment<ESTree.BreakStatement>) {
    let label: string | undefined;
    if (env.node.label) {
        label = env.node.label.name;
    }
    return Signal.Break(label);
}

export function ContinueStatement(env: Environment<ESTree.ContinueStatement>) {
    let label: string | undefined;
    if (env.node.label) {
        label = env.node.label.name;
    }
    return Signal.Continue(label);
}

export function IfStatement(env: Environment<ESTree.IfStatement>) {
    if (env.evaluate(env.node.test)) {
        return env.evaluate(env.node.consequent);
    } else if (env.node.alternate) {
        return env.evaluate(env.node.alternate);
    }
}

export function SwitchStatement(env: Environment<ESTree.SwitchStatement>) {
    const discriminant = env.evaluate(env.node.discriminant);

    let matched = false;
    for (const case_ of env.node.cases) {
        if (!matched && (!case_.test || discriminant === env.evaluate(case_.test))) {
            matched = true;
        }

        if (matched) {
            const signal: Signal = env.evaluate(case_);
            if (Signal.isBreak(signal)) {
                break;
            } else if (Signal.isContinue(signal)) {
                continue;
            } else if (Signal.isReturn(signal)) {
                return signal;
            }
        }
    }
}

export function SwitchCase(env: Environment<ESTree.SwitchCase>) {
    for (const node of env.node.consequent) {
        const signal: Signal = env.evaluate(node);
        if (Signal.isSignal(signal)) {
            return signal;
        }
    }
}

export function ThrowStatement(env: Environment<ESTree.ThrowStatement>) {
    throw env.evaluate(env.node.argument);
}

export function TryStatement(env: Environment<ESTree.TryStatement>) {
    const { block, handler, finalizer } = env.node;
    try {
        return env.evaluate(block);
    } catch (err) {
        if (handler) {
            const param = <ESTree.Identifier>handler.param;
            const scope = env.createBlockScope(true);
            scope.letDeclare(param.name, err);
            return env.evaluate(handler, { scope });
        }

        throw err;
    } finally {
        if (finalizer) {
            return env.evaluate(finalizer);
        }
    }
}

export function CatchClause(env: Environment<ESTree.CatchClause>) {
    return env.evaluate(env.node.body);
}

export function WhileStatement(env: Environment<ESTree.WhileStatement>) {
    while (env.evaluate(env.node.test)) {
        const signal: Signal = env.evaluate(env.node.body);

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

export function DoWhileStatement(env: Environment<ESTree.DoWhileStatement>) {
    do {
        const signal: Signal = env.evaluate(env.node.body);

        if (Signal.isSignal(signal)) {
            if (Signal.isBreak(signal)) {
                if (!signal.value || signal.value === env.label) break;
            } else if (Signal.isContinue(signal)) {
                if (!signal.value || signal.value === env.label) continue;
            }
            return signal;
        }
    } while (env.evaluate(env.node.test));
}

export function ForStatement(env: Environment<ESTree.ForStatement>) {
    const node = env.node;

    let scope = env.scope;
    if (node.init && node.init.type === 'VariableDeclaration') {
        scope = env.createBlockScope();
    }

    for (
        node.init && env.evaluate(node.init, { scope });
        node.test ? env.evaluate(node.test, { scope }) : true;
        node.update && env.evaluate(node.update, { scope })
    ) {
        const signal: Signal = env.evaluate(node.body, { scope });

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

export function ForInStatement(env: Environment<ESTree.ForInStatement>) {
    const { left, right, body } = env.node;
    let scope = env.scope;

    let value: Value;
    if (left.type === 'VariableDeclaration') {
        const id = left.declarations[0].id as ESTree.Identifier;
        value = scope.declare(id.name, undefined, left.kind);

    } else if (left.type === 'Identifier') {
        value = scope.get(left.name, true);

    } else {
        throw new Error(`evil-eval: [ForInStatement] Unsupported left type "${left.type}"`);
    }

    for (const key in env.evaluate(right)) {
        value.v = key;

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

export function FunctionDeclaration(env: Environment<ESTree.FunctionDeclaration>) {
    const fn = FunctionExpression(<any>env);
    env.scope.varDeclare(env.node.id.name, fn);
}

export function VariableDeclaration(env: Environment<ESTree.VariableDeclaration>) {
    for (const declarator of env.node.declarations) {
        const { name } = <ESTree.Identifier>declarator.id;
        const value = declarator.init ? env.evaluate(declarator.init) : undefined;
        env.scope.declare(name, value);
    }
}

export function VariableDeclarator(env: Environment<ESTree.VariableDeclarator>) {
    throw new Error(`evil-eval: [VariableDeclarator] Should not happen`);
}

export function ThisExpression(env: Environment<ESTree.ThisExpression>) {
    const thisValue = env.scope.get('this');
    return thisValue ? thisValue.v : null;
}

export function ArrayExpression(env: Environment<ESTree.ArrayExpression>) {
    return env.node.elements.map(it => env.evaluate(it));
}

export function ObjectExpression(env: Environment<ESTree.ObjectExpression>) {
    const obj: { [key: string]: any } = {};

    for (const property of env.node.properties) {
        let key: string;
        if (property.key.type === 'Literal') {
            key = property.key.value as string;
        } else if (property.key.type === 'Identifier') {
            key = property.key.name;
        } else {
            throw new Error(`evil-eval: [ObjectExpression] Unsupported property key type "${property.key.type}"`);
        }
        obj[key] = env.evaluate(property.value);
    }

    return obj;
}

export function Property(env: Environment<ESTree.Property>) {
    throw new Error(`evil-eval: [Property] Should not happen`);
}

export function FunctionExpression(env: Environment<ESTree.FunctionExpression>) {
    const node = env.node;
    const fn = function (this: any) {
        const scope = env.createFunctionScope(true);

        scope.constDeclare('this', this);
        scope.constDeclare('arguments', arguments);

        for (let i = 0, l = node.params.length; i < l; i++) {
            const { name } = <ESTree.Identifier>node.params[i];
            scope.varDeclare(name, arguments[i]);
        }

        const signal = env.evaluate(node.body, { scope });
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

const UnaryExpressionOperatorEvaluateMap = {
    '-': (env: Environment<ESTree.UnaryExpression>) => -env.evaluate(env.node.argument),
    '+': (env: Environment<ESTree.UnaryExpression>) => +env.evaluate(env.node.argument),
    '!': (env: Environment<ESTree.UnaryExpression>) => !env.evaluate(env.node.argument),
    '~': (env: Environment<ESTree.UnaryExpression>) => ~env.evaluate(env.node.argument),
    'typeof': (env: Environment<ESTree.UnaryExpression>) => {
        if (env.node.argument.type === 'Identifier') {
            try {
                const value = env.scope.get(env.node.argument.name);
                return value ? typeof value.v : 'undefined';
            } catch (err) {
                if (err.message === `${env.node.argument.name} is not defined`) {
                    return 'undefined';
                } else {
                    throw err;
                }
            }
        } else {
            return typeof env.evaluate(env.node.argument);
        }
    },
    'void': (env: Environment<ESTree.UnaryExpression>) => void env.evaluate(env.node.argument),
    'delete': (env: Environment<ESTree.UnaryExpression>) => {
        const argument = env.node.argument;
        if (argument.type === 'MemberExpression') {
            const obj = env.evaluate(argument.object);
            const name = getPropertyName(argument, env);
            return delete obj[name];
        } else if (argument.type === 'Identifier') {
            return false;
        } else if (argument.type === 'Literal') {
            return true;
        }
    }
};
export function UnaryExpression(env: Environment<ESTree.UnaryExpression>) {
    return UnaryExpressionOperatorEvaluateMap[env.node.operator](env);
}

const UpdateExpressionOperatorEvaluateMap = {
    '++': (value: Value, prefix: boolean) => prefix ? ++value.v : value.v++,
    '--': (value: Value, prefix: boolean) => prefix ? --value.v : value.v--
};
export function UpdateExpression(env: Environment<ESTree.UpdateExpression>) {
    const value = getIdentifierOrMemberExpressionValue(env.node.argument, env);
    return UpdateExpressionOperatorEvaluateMap[env.node.operator](value, env.node.prefix);
}

const BinaryExpressionOperatorEvaluateMap = {
    '==': (a: any, b: any) => a == b,
    '!=': (a: any, b: any) => a != b,
    '===': (a: any, b: any) => a === b,
    '!==': (a: any, b: any) => a !== b,
    '<': (a: any, b: any) => a < b,
    '<=': (a: any, b: any) => a <= b,
    '>': (a: any, b: any) => a > b,
    '>=': (a: any, b: any) => a >= b,
    '<<': (a: any, b: any) => a << b,
    '>>': (a: any, b: any) => a >> b,
    '>>>': (a: any, b: any) => a >>> b,
    '+': (a: any, b: any) => a + b,
    '-': (a: any, b: any) => a - b,
    '*': (a: any, b: any) => a * b,
    '/': (a: any, b: any) => a / b,
    '%': (a: any, b: any) => a % b,
    '**': (a: any, b: any) => a ** b,
    '|': (a: any, b: any) => a | b,
    '^': (a: any, b: any) => a ^ b,
    '&': (a: any, b: any) => a & b,
    'in': (a: any, b: any) => a in b,
    'instanceof': (a: any, b: any) => a instanceof b
};
export function BinaryExpression(env: Environment<ESTree.BinaryExpression>) {
    const a = env.evaluate(env.node.left);
    const b = env.evaluate(env.node.right);
    return BinaryExpressionOperatorEvaluateMap[env.node.operator](a, b);
}

const AssignmentExpressionOperatorEvaluateMap = {
    '=': (value: Value, v: any) => value.v = v,
    '+=': (value: Value, v: any) => value.v += v,
    '-=': (value: Value, v: any) => value.v -= v,
    '*=': (value: Value, v: any) => value.v *= v,
    '/=': (value: Value, v: any) => value.v /= v,
    '%=': (value: Value, v: any) => value.v %= v,
    '**=': (value: Value, v: any) => value.v **= v,
    '<<=': (value: Value, v: any) => value.v <<= v,
    '>>=': (value: Value, v: any) => value.v >>= v,
    '>>>=': (value: Value, v: any) => value.v >>>= v,
    '|=': (value: Value, v: any) => value.v |= v,
    '^=': (value: Value, v: any) => value.v ^= v,
    '&=': (value: Value, v: any) => value.v &= v
};
export function AssignmentExpression(env: Environment<ESTree.AssignmentExpression>) {
    const node = env.node;
    const value = getIdentifierOrMemberExpressionValue(node.left, env, node.operator === '=');
    return AssignmentExpressionOperatorEvaluateMap[node.operator](value, env.evaluate(node.right));
}

const LogicalExpressionOperatorEvaluateMap = {
    '||': (a: any, b: any) => a || b,
    '&&': (a: any, b: any) => a && b
};
export function LogicalExpression(env: Environment<ESTree.LogicalExpression>) {
    const a = env.evaluate(env.node.left);
    const b = env.evaluate(env.node.right);
    return LogicalExpressionOperatorEvaluateMap[env.node.operator](a, b);
}

export function MemberExpression(env: Environment<ESTree.MemberExpression>) {
    const obj = env.evaluate(env.node.object);
    const name = getPropertyName(env.node, env);
    return obj[name];
}

export function ConditionalExpression(env: Environment<ESTree.ConditionalExpression>) {
    return env.evaluate(env.node.test)
        ? env.evaluate(env.node.consequent)
        : env.evaluate(env.node.alternate);
}

export function CallExpression(env: Environment<ESTree.CallExpression>) {
    const fn: Function = env.evaluate(env.node.callee);
    const args = env.node.arguments.map(it => env.evaluate(it));

    let thisValue: any;
    if (env.node.callee.type == 'MemberExpression') {
        thisValue = env.evaluate(env.node.callee.object);
    }

    return fn.apply(thisValue, args);
}

export function NewExpression(env: Environment<ESTree.NewExpression>) {
    const fn: Function = env.evaluate(env.node.callee);
    const args = env.node.arguments.map(arg => env.evaluate(arg));
    return new (fn.bind.apply(fn, [null].concat(args)));
}

export function SequenceExpression(env: Environment<ESTree.SequenceExpression>) {
    let last: any;
    for (const expression of env.node.expressions) {
        last = env.evaluate(expression);
    }
    return last;
}

// -- private --

export function getPropertyName(node: ESTree.MemberExpression, ctx: Environment<ESTree.Node>): string {
    if (node.computed) {
        return ctx.evaluate(node.property);
    } else {
        return (<ESTree.Identifier>node.property).name;
    }
}

export function getIdentifierOrMemberExpressionValue(node: ESTree.Pattern | ESTree.Expression, env: Environment<ESTree.Node>, assignment = false) {
    if (node.type === 'Identifier') {
        return env.scope.get(node.name, assignment);

    } else if (node.type === 'MemberExpression') {
        const obj = env.evaluate(node.object);
        const name = getPropertyName(node, env);
        return createMemberValue(obj, name);

    } else {
        throw new Error(`evil-eval: Not support to get value of node type "${node.type}"`);
    }
}
