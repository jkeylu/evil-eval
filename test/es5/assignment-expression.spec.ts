import { runInContext } from '../../src';

describe('AssignmentExpression', () => {
    test('=', () => {
        const code = `
            var a = 1;
            a = 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });

    test('+=', () => {
        const code = `
            var a = 1;
            a += 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });

    test('-=', () => {
        const code = `
            var a = 1;
            a -= 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(0);
    });

    test('*=', () => {
        const code = `
            var a = 2;
            a *= 3;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(6);
    });

    test('/=', () => {
        const code = `
            var a = 4;
            a /= 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });

    test('%=', () => {
        const code = `
            var a = 3;
            a %= 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(1);
    });

    test('<<=', () => {
        const code = `
            var a = 1;
            a <<= 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });

    test('>>=', () => {
        const code = `
            var a = 2;
            a >>= 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(1);
    });

    test('>>>=', () => {
        const code = `
            var a = 4;
            a >>>= 1;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(2);
    });

    test('|=', () => {
        const code = `
            var a = 1;
            a |= 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(3);
    });

    test('^=', () => {
        const code = `
            var a = 1;
            a ^= 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(3);
    });

    test('&=', () => {
        const code = `
            var a = 1;
            a &= 2;
            module.exports = a;
        `;
        const result = runInContext(code);
        expect(result).toBe(0);
    });
});