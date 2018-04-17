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
            expect(9 << 2).toBe(36);
        `;
        runInContext(code, { expect });
    });

    test('>>', () => {
        const code = `
            expect(9 >> 2).toBe(2);
        `;
        runInContext(code, { expect });
    });

    test('>>>', () => {
        const code = `
            expect(9 >>> 2).toBe(2);
        `;
        runInContext(code, { expect });
    });

    test('+', () => {
        const code = `
            expect(1 + 1).toBe(2);
        `;
        runInContext(code, { expect });
    });

    test('-', () => {
        const code = `
            expect(2 - 1).toBe(1);
        `;
        runInContext(code, { expect });
    });

    test('*', () => {
        const code = `
            expect(2 * 2).toBe(4);
        `;
        runInContext(code, { expect });
    });

    test('/', () => {
        const code = `
            expect(2 / 2).toBe(1);
        `;
        runInContext(code, { expect });
    });

    test('%', () => {
        const code = `
            expect(3 % 2).toBe(1);
        `;
        runInContext(code, { expect });
    });

    test('**', () => {
        const code = `
            expect(2 ** 2).toBe(4);
        `;
        runInContext(code, { expect });
    });

    test('|', () => {
        const code = `
            expect(0 | 0).toBe(0);
            expect(0 | 1).toBe(1);
            expect(1 | 0).toBe(1);
            expect(1 | 1).toBe(1);
        `;
        runInContext(code, { expect });
    });

    test('^', () => {
        const code = `
            expect(0 ^ 0).toBe(0);
            expect(0 ^ 1).toBe(1);
            expect(1 ^ 0).toBe(1);
            expect(1 ^ 1).toBe(0);
        `;
        runInContext(code, { expect });
    });

    test('&', () => {
        const code = `
            expect(0 & 0).toBe(0);
            expect(0 & 1).toBe(0);
            expect(1 & 0).toBe(0);
            expect(1 & 1).toBe(1);
        `;
        runInContext(code, { expect });
    });

    test('in', () => {
        const code = `
            var obj = { name: 'jkey' };
            expect('name' in obj).toBe(true);
            expect('age' in obj).toBe(false);
        `;
        runInContext(code, { expect });
    });

    test('instanceof', () => {
        const code = `
            function Dog() {}
            var dog = new Dog();
            expect(dog instanceof Dog).toBe(true);

            var cat = {};
            expect(cat instanceof Dog).toBe(false);
        `;
        runInContext(code, { expect });
    });
});
