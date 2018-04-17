import { runInContext } from '../../src';

describe('FunctionDeclaration', () => {
    test('basic', () => {
        const code = `
            function hello() {
                return 2;
            }
            module.exports = hello;
        `;
        const hello: Function = runInContext(code);
        expect(hello()).toBe(2);
    });
});