import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('SpreadElement', () => {
    test('basic', () => {
        const code = `
            const a = [1,2,3];
            const b = [4,5,6];
            module.exports = [...a, ...b];
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toEqual([1,2,3,4,5,6]);
    });
});