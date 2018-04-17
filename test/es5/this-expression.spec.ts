import { runInContext } from '../../src';

describe('ThisExpression', () => {
    test('basic', () => {
        const code = `
            function Dog(name) {
                this.name = name;
            }

            Dog.prototype.getName = function() {
                return this.name;
            };

            module.exports = new Dog('Pluto');
        `;
        const dog = runInContext(code);
        expect(dog.getName()).toBe('Pluto');
    });
});