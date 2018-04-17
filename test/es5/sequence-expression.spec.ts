import { runInContext } from '../../src';

describe('SequenceExpression', () => {
    test('basic', () => {
        const code = `
            var a = 1, b = 2;
            module.exports = (a += 1, a + b);
        `;
        const result = runInContext(code);
        expect(result).toBe(4);
    });
});