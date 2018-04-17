import { runInContext } from '../../src';

describe('LogicalExpression', () => {
    test('||', () => {
        const code = `
            expect(true || true).toBe(true);
            expect(true || false).toBe(true);
            expect(false || true).toBe(true);
            expect(false || false).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('&&', () => {
        const code = `
        expect(true && true).toBe(true);
        expect(true && false).toBe(false);
        expect(false && true).toBe(false);
        expect(false && false).toBe(false);
        `;
        runInContext(code, { expect });
    });
});