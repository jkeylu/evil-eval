import { runInContext } from '../../src';

describe('ForInStatement', () => {
    test('basic', () => {
        const code = `
            var obj = { a: 1, b: 1 };
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            module.exports = keys;
        `;
        const keys = runInContext(code);
        expect(keys).toEqual(['a', 'b']);
    });
});