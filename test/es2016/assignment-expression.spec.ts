import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2016' };

describe('AssignmentExpression', () => {
    test('**=', () => {
        const code = `
            var a = 2;
            a **= 3;
            module.exports = a;
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toBe(8);
    });
});