import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2016' };

describe('BinaryExpression', () => {
    test('**', () => {
        const code = `
            expect(2 ** 2).toBe(4);
        `;
        runInContext(code, { expect }, OPTIONS);
    });
});
