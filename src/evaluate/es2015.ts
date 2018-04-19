import * as ESTree from 'estree';
import Scope from '../scope';
import { Value } from '../value';
import Signal from '../signal';
import Environment from '../environment';

export function ObjectExpression(env: Environment<ESTree.ObjectExpression>) {
    const obj: { [key: string]: any } = {};

    for (const property of env.node.properties) {
        let key: string;
        if (!property.computed) {
            if (property.key.type === 'Literal') {
                key = property.key.value as string;
            } else if (property.key.type === 'Identifier') {
                key = property.key.name;
            } else {
                throw new Error(`evil-eval: [ObjectExpression] Unsupported property key type "${property.key.type}"`);
            }
        } else {
            if (property.key.type === 'Identifier') {
                const value = env.scope.get(property.key.name);
                key = value.v;
            } else {
                key = env.evaluate(property.key);
            }
        }

        const value = env.evaluate(property.value);
        if (property.kind === 'init') {
            obj[key] = value;
        } else if (property.kind === 'get') {
            Object.defineProperty(obj, key, { get: value });
        } else if (property.kind === 'set') {
            Object.defineProperty(obj, key, { set: value });
        } else {
            throw new Error(`evil-eval: [ObjectExpression] Unsupported property kind "${property.kind}"`);
        }
    }

    return obj;
}

export function ForOfStatement(env: Environment<ESTree.ForOfStatement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function Super(env: Environment<ESTree.Super>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function SpreadElement(env: Environment<ESTree.SpreadElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ArrowFunctionExpression(env: Environment<ESTree.ArrowFunctionExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function YieldExpression(env: Environment<ESTree.YieldExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TemplateLiteral(env: Environment<ESTree.TemplateLiteral>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TaggedTemplateExpression(env: Environment<ESTree.TaggedTemplateExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function TemplateElement(env: Environment<ESTree.TemplateElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ObjectPattern(env: Environment<ESTree.ObjectPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ArrayPattern(env: Environment<ESTree.ArrayPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function RestElement(env: Environment<ESTree.RestElement>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function AssignmentPattern(env: Environment<ESTree.AssignmentPattern>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassBody(env: Environment<ESTree.ClassBody>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function MethodDefinition(env: Environment<ESTree.MethodDefinition>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassDeclaration(env: Environment<ESTree.ClassDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ClassExpression(env: Environment<ESTree.ClassExpression>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function MetaProperty(env: Environment<ESTree.MetaProperty>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportDeclaration(env: Environment<ESTree.ImportDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportSpecifier(env: Environment<ESTree.ImportSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportDefaultSpecifier(env: Environment<ESTree.ImportDefaultSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ImportNamespaceSpecifier(env: Environment<ESTree.ImportNamespaceSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportNamedDeclaration(env: Environment<ESTree.ExportNamedDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportSpecifier(env: Environment<ESTree.ExportSpecifier>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportDefaultDeclaration(env: Environment<ESTree.ExportDefaultDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}

export function ExportAllDeclaration(env: Environment<ESTree.ExportAllDeclaration>) {
    throw new Error(`evil-eval: "${env.node.type}" not implemented`);
}
