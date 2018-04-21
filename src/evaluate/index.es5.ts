import * as ES5 from './es5';
import * as ESTree from 'estree';
import Environment from '../environment';

export interface EvaluateMap {
    [name: string]: (env: Environment<ESTree.Node>) => any;
}

const es5: EvaluateMap = <any>ES5;

const evaluate: { [name: string]: EvaluateMap } = {
    es5,
    '5': es5
};

export default evaluate;
