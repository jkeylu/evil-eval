import { runInContext } from '../../src';

describe('ConditionalExpression', () => {
    test('basic', () => {
        const code = `
            var a = 1;
            var b = 2;
            module.exports = a > b ? 3 : 4;
        `;
        const result = runInContext(code);
        expect(result).toBe(4);
    });
});