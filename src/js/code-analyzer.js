import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: true});
    var model = [];
    parsedCode.body.forEach(function (element) {
        parseData(element, model);
    });
    return model;
};

export {
    parseCode,
    parseFunctionDeclaration,
    parseVariableDeclaration,
    parseExpressionStatement,
    parseReturnStatement,
    parseWhileStatement,
    parseIfStatement,
    parseForStatement,
    parseUpdateExpression,
    parseAssignmentExpression
};

function parseData(data, model) {
    return parseDataType[data.type](data, model);
}

const parseDataType =
    {
        'FunctionDeclaration': parseFunctionDeclaration,
        'VariableDeclaration': parseVariableDeclaration,
        'ExpressionStatement': parseExpressionStatement,
        'ReturnStatement': parseReturnStatement,
        'WhileStatement': parseWhileStatement,
        'IfStatement': parseIfStatement,
        'ForStatement': parseForStatement,
        'UpdateExpression': parseUpdateExpression,
        'AssignmentExpression': parseAssignmentExpression
    };

function parseFunctionDeclaration(data, model) {
    insertMapIntoModel(data.loc.start.line, 'FunctionDeclaration', data.id.name, '', '', model);
    data.params.forEach(function (element) {
        insertMapIntoModel(element.loc.start.line, 'VariableDeclaration', element.name, '', '', model);
    });
    data.body.body.forEach(function (element) {
        parseData(element, model);
    });
}

function parseVariableDeclaration(data, model) {
    data.declarations.forEach(function (element) {
        if (element.init === null) {
            insertMapIntoModel(element.id.loc.start.line, 'VariableDeclaration', element.id.name, '', '', model);
        }
        else {
            insertMapIntoModel(element.id.loc.start.line, 'VariableDeclaration', element.id.name, '', escodegen.generate(element.init), model);
        }
    });
}

function parseExpressionStatement(data, model) {
    let expressionType = data.expression.type;
    switch (expressionType) {
    case 'UpdateExpression':
        parseUpdateExpression(data.expression, model);
        break;
    case 'AssignmentExpression':
        parseAssignmentExpression(data.expression, model);
        break;
    }
}

function parseReturnStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'ReturnStatement', '', '', escodegen.generate(data.argument), model);
}

function parseWhileStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'WhileStatement', '', escodegen.generate(data.test), '', model);
    data.body.body.forEach(function (element) {
        parseData(element, model);
    });
}

function parseIfStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'IfStatement', '', escodegen.generate(data.test), '', model);
    if (data.consequent.type.localeCompare('BlockStatement') === 0) {
        data.consequent.body.forEach(function (element) {
            parseData(element, model);
        });
    }
    else {
        parseData(data.consequent.expression, model);
    }

    if (data.alternate !== null) {
        if ((data.alternate.type).localeCompare('IfStatement') === 0) {
            parseElseIfStatement(data.alternate, model);
        }
        else {
            parseElseStatement(data.alternate, model);
        }
    }
}

function parseElseStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'ElseStatement', '', '', '', model);
    if (data.type.localeCompare('BlockStatement') === 0) {
        data.body.forEach(function (element) {
            parseData(element, model);
        });
    }
    else {
        parseData(data, model);
    }
}

function parseElseIfStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'ElseIfStatement', '', escodegen.generate(data.test), '', model);
    if (data.consequent.type.localeCompare('BlockStatement') === 0) {
        data.consequent.body.forEach(function (element) {
            parseData(element, model);
        });
    }
    else {
        parseData(data.consequent.expression, model);
    }
    if (data.alternate !== null) {
        if ((data.alternate.type).localeCompare('IfStatement') === 0) {
            parseElseIfStatement(data.alternate, model);
        }
        else {
            parseElseStatement(data.alternate, model);
        }
    }
}

function parseForStatement(data, model) {
    insertMapIntoModel(data.loc.start.line, 'ForStatement', '', escodegen.generate(data.init) + ';' +
        escodegen.generate(data.test) + ';' + escodegen.generate(data.update), '', model);
    data.body.body.forEach(function (element) {
        parseData(element, model);
    });
}

function parseUpdateExpression(data, model) {
    insertMapIntoModel(data.loc.start.line, 'UpdateExpression', data.argument.name, '', '', model);
}

function parseAssignmentExpression(data, model) {
    if (data.operator.localeCompare('+=') === 0) {
        insertMapIntoModel(data.loc.start.line, 'AssignmentExpression', data.left.name, '', data.left.name + ' + ' + escodegen.generate(data.right), model);
    }
    else if (data.operator.localeCompare('-=') === 0) {
        insertMapIntoModel(data.loc.start.line, 'AssignmentExpression', data.left.name, '', data.left.name + ' - ' + escodegen.generate(data.right), model);
    }
    else {
        insertMapIntoModel(data.loc.start.line, 'AssignmentExpression', data.left.name, '', escodegen.generate(data.right), model);
    }
}

function insertMapIntoModel(line, type, name, condition, value, model) {
    model.push({
        'Line': line,
        'Type': type,
        'Name': name,
        'Condition': condition,
        'Value': value
    });
}