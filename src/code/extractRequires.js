import esprima from 'esprima';
import {traverse} from 'estraverse';

// esprima options
const options = {
    sourceType: 'module',
};

const isRequire = (node) => node.type === 'CallExpression' &&
    node.callee && node.callee.type === 'Identifier' && node.callee.name === 'require' &&
    node.arguments && node.arguments.length === 1 && node.arguments[0] !== undefined;

export const extractRequires = (code) => {
    const ast = esprima.parse(code, options);
    const requires = [];

    traverse(ast, {
        enter(node) {
            if (isRequire(node)) {
                requires.push(node.arguments[0].value);
            }
        }
    });

    return requires;
};
