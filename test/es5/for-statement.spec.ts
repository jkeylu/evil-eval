import { runInContext } from '../../src';

describe('ForStatement', () => {
    test('basic', () => {
        const code = `
            var count = 0;
            for(var i = 0; i < 10; i++) {
                count += i;
            }

            module.exports = count;
        `;
        const result = runInContext(code);
        expect(result).toBe(45);
    });
});