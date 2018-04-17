import { runInContext } from '../../src';

describe('IfStatement', () => {
    test('basic', () => {
        const code = `
            function test(i) {
                if (i == 1) {
                    return i + 1;
                } else if (i == 2) {
                    return i + 2;
                } else {
                    return i + 3;
                }
            }

            expect(test(1)).toBe(2);
            expect(test(2)).toBe(4);
            expect(test(3)).toBe(6);
        `;
        runInContext(code, { expect });
    });
});