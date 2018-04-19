import * as ESTree from 'estree';
import Environment from './environment';
import { Value, createMemberValue } from './value';

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
