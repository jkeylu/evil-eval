import { runInContext, RunInContextOptions } from '../../src';

const OPTIONS: RunInContextOptions = { ecmaVersion: 'es2015' };

describe('ClassDeclaration', () => {
    test('basic', () => {
        const code = `
            class People {
                get name() {
                    return this._name;
                }
                set name(name) {
                    this._name = name;
                }
                constructor(name) {
                    this._name = name;
                }

                speak() {
                    return 'My name is ' + this.name;
                }
            }

            module.exports = new People('jKey');
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result.name).toBe('jKey');
        expect(result.speak()).toBe('My name is jKey');
        result.name = 'jKey Lu';
        expect(result.name).toBe('jKey Lu');
    });

    test('extends', () => {
        const code = `
            class People {
                constructor(name) {
                    this.name = name;
                }

                speak() {
                    return this.name;
                }
            }

            class JKey extends People {
                constructor(name, age) {
                    super(name);
                    this.age = age;
                }

                speak() {
                    return 'My name is ' + super.speak();
                }
            }

            module.exports = new JKey('jKey', 29);
        `;
        const result = runInContext(code, {}, OPTIONS);
        expect(result.name).toBe('jKey');
        expect(result.speak()).toBe('My name is jKey');
    });
});
