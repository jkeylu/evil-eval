import * as ES5 from './es5';
import * as ES2015 from './es2015';
import * as ES2016 from './es2016';
import * as ES2017 from './es2017';
import * as ES2018 from './es2018';
import * as ESTree from 'estree';
import Environment from '../environment';

export interface EvaluateMap {
    [name: string]: (env: Environment<ESTree.Node>) => any;
}

const es5: EvaluateMap = <any>ES5;
const es2015: EvaluateMap = <any>{ ...es5, ...ES2015 };
const es2016: EvaluateMap = <any>{ ...es2015, ...ES2016 };
const es2017: EvaluateMap = <any>{ ...es2016, ...ES2017 };
const es2018: EvaluateMap = <any>{ ...es2017, ...ES2018 };

const evaluate: { [name: string]: EvaluateMap } = {
    '5': es5,
    '6': es2015,
    '7': es2016,
    '8': es2017,
    '9': es2018
};

export default evaluate;
