import { runInContext } from '../../src';

describe('DoWhileStatement', () => {
    test('basic', () => {
        const code = `
            var i = 10;
            var count = 0;
            do {
                count += i;
                i--;
            } while(i > 0)
            module.exports = count;
        `;
        const result = runInContext(code);
        expect(result).toBe(55);
    });
});