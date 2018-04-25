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

const ecmaVersionMap = {
    es5: 5,
    es2015: 6,
    es2016: 7,
    es2017: 8,
    es2018: 9,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9
};

export default class Script {
    code: string;
    ast: ESTree.Program;
    evaluateMap: EvaluateMap;
    options: ScriptOptions;

    constructor(code: string, options: ScriptOptions = {}) {
        this.options = {
            ecmaVersion: 5,
            sourceType: 'module',
            ...options
        };
        this.options.ecmaVersion = <any>ecmaVersionMap[this.options.ecmaVersion!];

        this.code = code;
        this.ast = acorn.parse(this.code, <any>this.options);
        this.evaluateMap = evaluate[this.options.ecmaVersion!];
    }

    runInContext(sandbox: any = {}) {
        const scope = this.createGlobalScope(sandbox);
        const env = new Environment(null, scope, this.evaluateMap);

        if (this.options.sourceType === 'module') {
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
