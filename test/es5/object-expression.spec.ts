import { runInContext } from '../../src';

describe('ObjectExpression', () => {
    test('case 1', () => {
        const code = `
            module.exports = { a: 1 };
        `;
        const result = runInContext(code);
        expect(result).toEqual({ a: 1 });
    });

    test('case 2', () => {
        const code = `
            var obj = { a: 1 };
            obj.b = 2;
            module.exports = obj;
        `;
        const result = runInContext(code);
        expect(result).toEqual({ a: 1, b: 2 });
    });
});