import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';

export function AwaitExpression(env: Environment<ESTree.AwaitExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}
