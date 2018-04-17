import { runInContext } from '../../src';

describe('MemberExpression', () => {
    test('basic', () => {
        const code = `
            var obj = { a: 1 };
            module.exports = obj.a;
        `;
        const result = runInContext(code);
        expect(result).toBe(1);
    });
});