import { runInContext } from '../../src';

describe('CallExpression', () => {
    test('call function', () => {
        const code = `
            function hello(a, b) {
                return a + b;
            }

            module.exports = hello(1, 2);
        `;
        const result = runInContext(code);
        expect(result).toBe(3);
    });
});
