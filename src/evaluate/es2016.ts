import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';
import * as ES5EvaluateMap from './es5';

export const BinaryExpressionOperatorEvaluateMap = {
    ...ES5EvaluateMap.BinaryExpressionOperatorEvaluateMap,
    '**': (a: any, b: any) => a ** b
};
export function BinaryExpression(env: Environment<ESTree.BinaryExpression>) {
    const a = env.evaluate(env.node.left);
    const b = env.evaluate(env.node.right);
    return BinaryExpressionOperatorEvaluateMap[env.node.operator](a, b);
}

export const AssignmentExpressionOperatorEvaluateMap = {
    ...ES5EvaluateMap.AssignmentExpressionOperatorEvaluateMap,
    '**=': (value: Value, v: any) => value.v **= v
};
export function AssignmentExpression(env: Environment<ESTree.AssignmentExpression>) {
    const node = env.node;
    const value = ES5EvaluateMap.getIdentifierOrMemberExpressionValue(node.left, env, node.operator === '=');
    return AssignmentExpressionOperatorEvaluateMap[node.operator](value, env.evaluate(node.right));
}
