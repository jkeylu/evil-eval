import { runInContext } from '../../src';

describe('BinaryExpression', () => {
    test('==', () => {
        const code = `
            var a, b;

            a = 2;
            b = 2;
            expect(a == b).toBe(true);

            a = {};
            b = {};
            expect(a == b).toBe(false);

            a = {};
            b = a;
            expect(a == b).toBe(true);

            a = null;
            b = undefined;
            expect(a == b).toBe(true);
        `;
        runInContext(code, { expect });
    });

    test('!=', () => {
        const code = `
            var a, b;

            a = 1;
            b = 2;
            expect(a != b).toBe(true);

            a = {};
            b = {};
            expect(a != b).toBe(true);

            a = {};
            b = a;
            expect(a != b).toBe(false);

            a = null;
            b = undefined;
            expect(a != b).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('===', () => {
        const code = `
            var a, b;

            a = null;
            b = undefined;
            expect(a === b).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('!==', () => {
        const code = `
            var a, b;

            a = null;
            b = undefined;
            expect(a !== b).toBe(true);
        `;
        runInContext(code, { expect });
    });

    test('<', () => {
        const code = `
            expect(1 < 2).toBe(true);
            expect(1 < 1).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('<=', () => {
        const code = `
            expect(1 <= 2).toBe(true);
            expect(1 <= 1).toBe(true);
            expect(1 <= 0).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('>', () => {
        const code = `
            expect(2 > 1).toBe(true);
            expect(1 > 1).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('>=', () => {
        const code = `
            expect(2 >= 1).toBe(true);
            expect(1 >= 1).toBe(true);
            expect(0 >= 1).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('<<', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('>>', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('>>>', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('+', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('-', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('*', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('/', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('%', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('**', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('|', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('^', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('&', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('in', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });

    test('instanceof', () => {
        const code = `
        `;
        runInContext(code, { expect });
    });
});
