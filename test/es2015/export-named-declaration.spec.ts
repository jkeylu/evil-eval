import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('ExportNamedDeclaration', () => {
    test('basic', () => {
        const code = `
            export const a = 1, b = 2;
            export function foo() {
                return 'foo'
            }
            export class Foo {
                bar() {
                    return 'Foo:bar';
                }
            }
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
        expect(result.foo()).toBe('foo');
        expect(new result.Foo().bar()).toBe('Foo:bar');
    });
});
