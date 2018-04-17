import { runInContext } from '../../src';

describe('SwitchStatement', () => {
    test('basic', () => {
        const code = `
            var i = 1;
            switch(i) {
                case 1:
                    i++;
                case 2:
                    i++;
                    break;
                case 3:
                    i++;
                    break;
            }
            module.exports = i;
        `;
        const result = runInContext(code);
        expect(result).toBe(3);
    });
});