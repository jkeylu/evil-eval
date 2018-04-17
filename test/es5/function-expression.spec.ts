import { runInContext } from '../../src';

describe('FunctionExpression', () => {
    test('basic', () => {
        const code = `
            var hello = function() {
                return 2;
            }
            module.exports = hello;
        `;
        const hello: Function = runInContext(code);
        expect(hello()).toBe(2);
    });
});