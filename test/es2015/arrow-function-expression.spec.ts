import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('ArrowFunctionExpression', () => {
    test('basic', () => {
        const code = `
            module.exports = (bar) => { return bar; };
        `;
        const foo = runInContext(code, {}, OPTIONS);
        expect(foo('bar')).toBe('bar');
    });

    test('in class method', () => {
        const code = `
            class Foo {
                constructor(name) {
                    this.name = name;
                }

                bar() {
                    const hello = () => {
                        return 'Hello ' + this.name;
                    };
                    return hello();
                }
            }
            module.exports = new Foo('jKey').bar();
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result).toBe('Hello jKey');
    });
});