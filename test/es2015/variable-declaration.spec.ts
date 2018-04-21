import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('VariableDeclaration', () => {
    test('let', () => {
        const code = `
            let i = 1;
            {
                let i = 2;
            }
            module.exports = i;
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toBe(1);
    });

    test('const', () => {
        const code = `
            const a = 1;
            a = 2;
        `;
        expect(() => runInContext(code, {}, OPTIONS)).toThrow('Assignment to constant variable');
    });

    test('let { a } = obj', () => {
        const code = `
            let {a, b} = {a: 1, b: 2};
            expect(a).toBe(1);
            expect(b).toBe(2);
        `;
        runInContext(code, { expect }, OPTIONS);
    });

    test('let [a] = arr', () => {
        const code = `
            let [a, b] = [1, 2];
            expect(a).toBe(1);
            expect(b).toBe(2);
        `;
        runInContext(code, { expect }, OPTIONS);
    });
});