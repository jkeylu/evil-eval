import { runInContext } from '../../src';

describe('NewExpression', () => {
    test('basic', () => {
        const code = `
            function Dog(name) {
                this.name = name;
            }
            var dog = new Dog('Pluto')
            module.exports = dog;
        `;
        const dog = runInContext(code);
        expect(dog.name).toBe('Pluto');
    });
});