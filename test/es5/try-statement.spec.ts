import { runInContext } from '../../src';

describe('TryStatement', () => {
    test('basic', () => {
        const code = `
            var a = 1;
            try {
                throw new Error('test error');
                a += 2;
            } catch(e) {
                a += 3;
                expect(e.message).toBe('test error');
            } finally {
                expect(a).toBe(4);
            }
        `;
        runInContext(code, { expect });
    });
});