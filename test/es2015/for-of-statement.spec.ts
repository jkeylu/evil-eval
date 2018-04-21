import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('ForOfStatement', () => {
    test('for (let it of list)', () => {
        const code = `
            const result = [];
            for (let num of [1, 2, 3]) {
                result.push(num);
            }
            module.exports = result;
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toEqual([1, 2, 3]);
    });

    test('for (let { id } of list)', () => {
        const code = `
            const list = [
                { id: 1 },
                { id: 2 },
                { id: 3 }
            ];
            const result = [];
            for (let { id } of list) {
                result.push(id);
            }
            module.exports = result;
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toEqual([1, 2, 3]);
    });

    test('for (let { arr: [a, ...b] } of list)', () => {
        const code = `
            const list = [
                { arr: [1, 2, 3] }
            ];
            const result = [];
            for (let { arr: [a, ...b]} of list) {
                result.push(a, b);
            }
            module.exports = result;
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toEqual([1, [2, 3]]);
    });
});