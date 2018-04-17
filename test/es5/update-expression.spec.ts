import { runInContext } from '../../src';

describe('UpdateExpression', () => {
    test('++', () => {
        const code = `
            var i = 1;
            expect(i++).toBe(1);

            i = 1;
            expect(++i).toBe(2);
        `;
        runInContext(code, { expect });
    });

    test('--', () => {
        const code = `
            var i = 1;
            expect(i--).toBe(1);

            i = 1;
            expect(--i).toBe(0);
        `;
        runInContext(code, { expect });
    });
});