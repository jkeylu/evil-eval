import * as ESTree from 'estree';
import Scope from './scope';
import { EvaluateMap } from './evaluate';

export interface EvaluateOptions {
    scope?: Scope;
    label?: string;
}

export default class Environment<T> {
    scope: Scope;
    node: T;
    evaluateMap: EvaluateMap;
    label?: string;

    constructor(node: T, scope: Scope, evaluateMap: EvaluateMap) {
        this.node = node;
        this.scope = scope;
        this.evaluateMap = evaluateMap;
    }

    evaluate(node: ESTree.Node, opts: EvaluateOptions = {}): any {
        const scope = opts.scope || this.scope;
        const env = new Environment(node, scope, this.evaluateMap);

        if (opts.label) {
            env.label = opts.label;
        }

        const evaluate = this.evaluateMap[node.type];
        if (!evaluate) {
            throw new Error();
        }

        return evaluate(env);
    }

    createBlockScope(invasive = false) {
        const scope = new Scope('block', this.scope);
        scope.invasive = invasive;
        return scope;
    }

    createFunctionScope(invasive = false) {
        const scope = new Scope('function', this.scope);
        scope.invasive = invasive;
        return scope;
    }
}
