import { runInContext } from '../../src';

describe('LogicalExpression', () => {
    test('||', () => {
        const code = `

        `;
        runInContext(code, {expect});
    });

    test('&&', () => {
        const code = `

        `;
        runInContext(code);
    });
});