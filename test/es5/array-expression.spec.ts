import { runInContext } from '../../src';

describe('ArrayExpression', () => {
    test('case 1', () => {
        const code = `
            module.exports = [1, 2, 3];
        `;
        const result = runInContext(code);
        expect(result).toEqual([1, 2, 3]);
    });

    test('case 2', () => {
        const code = `
            var arr = [1, 2, 3];
            arr.push(4);
            module.exports = arr;
        `;
        const result = runInContext(code);
        expect(result).toEqual([1, 2, 3, 4]);
    })
});