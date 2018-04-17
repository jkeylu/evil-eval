import { runInContext } from '../../src';

describe('VariableDeclaration', () => {
    test('var', () => {
        const code = `
            var a = 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(1);
    });

    test('duplicate var', () => {
        const code = `
            var a = 1;
            var a = 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });
});