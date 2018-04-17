import * as acorn from 'acorn';
import * as ESTree from 'estree';
import evaluate, { EvaluateMap } from './evaluate';
import Environment from './environment';
import Scope from './scope';
import Sandbox from './sandbox';
import GLOBAL from './global';
import { createSimpleValue } from './value';

export interface ScriptOptions {
    ecmaVersion?: 'es5' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 5 | 6 | 7 | 8 | 9;
    sourceType?: 'script' | 'module';
}

export default class Script {
    code: string;
    ast: ESTree.Program;
    evaluateMap: EvaluateMap;
    sourceType: 'script' | 'module';

    constructor(code: string, options: ScriptOptions = {}) {
        this.code = code;
        this.ast = acorn.parse(this.code);
        this.evaluateMap = evaluate[options.ecmaVersion || 'es5'];
        this.sourceType = options.sourceType || 'module';
    }

    runInContext(sandbox: any = {}) {
        const scope = this.createGlobalScope(sandbox);
        const env = new Environment(null, scope, this.evaluateMap);

        if (this.sourceType === 'module') {
            const exports = {};
            const module = { exports };
            scope.declaration['exports'] = createSimpleValue(exports);
            scope.declaration['module'] = createSimpleValue(module);

            env.evaluate(this.ast);

            return module.exports;

        } else {
            return env.evaluate(this.ast);
        }
    }

    private createGlobalScope(sandbox: any) {
        const scope = new Scope('function');
        scope.sandbox = new Sandbox(sandbox);

        const sandboxKeys = Object.keys(sandbox);
        const globalKeys = Object.keys(GLOBAL);
        for (const key of globalKeys) {
            if (sandboxKeys.indexOf(key) < 0) {
                scope.declaration[key] = createSimpleValue(GLOBAL[key]);
            }
        }

        return scope;
    }
}
