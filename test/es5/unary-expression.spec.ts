import { runInContext } from '../../src';

describe('UnaryExpression', () => {
    test('-', () => {
        const code = `
            var a = 1;
            module.exports = -a;
        `;
        const result = runInContext(code);
        expect(result).toBe(-1);
    });

    test('+', () => {
        const code = `
            var a = -1;
            module.exports = +a;
        `;
        const result = runInContext(code);
        expect(result).toBe(-1);
    });

    test('!', () => {
        const code = `
            var a = true;
            expect(!a).toBe(false);

            a = '';
            expect(!a).toBe(true);
        `;
        runInContext(code, { expect });
    });

    test('~', () => {
        const code = `
            expect(~0).toBe(-1);
            expect(~-1).toBe(0);

            var a = '3.14';
            expect(~~a).toBe(3);
        `;
        runInContext(code, { expect });
    });

    test('typeof', () => {
        const code = `
            expect(typeof 1).toBe('number');
            expect(typeof 'a').toBe('string');
            expect(typeof true).toBe('boolean');
            expect(typeof {}).toBe('object');
            expect(typeof xx).toBe('undefined');
        `;
        runInContext(code, { expect });
    });

    test('void', () => {
        const code = `
            expect(void 1).toBe(undefined);
        `;
        runInContext(code, { expect });
    });

    test('delete', () => {
        const code = `
            var obj = { a: 1 };
            delete obj.a;
            expect(obj).toEqual({});
        `;
        runInContext(code, { expect });
    });
});