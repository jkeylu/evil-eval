import { runInContext } from '../../src';

describe('WhileStatement', () => {
    test('basic', () => {
        const code = `
            var i = 10;
            var count = 0;
            while (i > 0) {
                count += i;
                i--;
            }
            module.exports = count;
        `;
        const result = runInContext(code);
        expect(result).toBe(55);
    });
});