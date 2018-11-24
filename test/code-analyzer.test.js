import assert from 'assert';
import {
    parseFunctionDeclaration,
    parseVariableDeclaration,
    parseExpressionStatement,
    parseWhileStatement,
    parseIfStatement,
    parseForStatement,
    parseCode
} from '../src/js/code-analyzer';
import * as esprima from 'esprima';

describe('The javascript parser', () => {
    it('parseWhileStatement Simple Test', () => {
        let code = 'while(x > 5){}';
        let model = [];
        parseWhileStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"WhileStatement","Name":"","Condition":"x > 5","Value":""}]'
        );
    });
    it('parseWhileStatement Advanced Test', () => {
        let code = 'while(Y <= 5 && X == 3){Y=Y+2;}';
        let model = [];
        parseWhileStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"WhileStatement","Name":"","Condition":"Y <= 5 && X == 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"Y","Condition":"","Value":"Y + 2"}]'
        );
    });
    it('parseForStatement Simple Test 1', () => {
        let code = 'for(i=0;i<5;i++){}';
        let model = [];
        parseForStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"ForStatement","Name":"","Condition":"i = 0;i < 5;i++","Value":""}]'
        );
    });
    it('parseForStatement Simple Test 2', () => {
        let code = 'for(let i=0;i<5;i++){}';
        let model = [];
        parseForStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"ForStatement","Name":"","Condition":"let i = 0;i < 5;i++","Value":""}]'
        );
    });
    it('parseForStatement Advanced Test 1', () => {
        let code = 'for(i=0;i<5;i++){x=x+5;}';
        let model = [];
        parseForStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"ForStatement","Name":"","Condition":"i = 0;i < 5;i++","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 5"}]'
        );
    });
    it('parseForStatement Advanced Test 2', () => {
        let code = 'for(let i=0;i<5;i++){x=x+5;}';
        let model = [];
        parseForStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"ForStatement","Name":"","Condition":"let i = 0;i < 5;i++","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 5"}]'
        );
    });
    it('parseFunctionDeclaration Simple Test', () => {
        let code = 'function mergeSort (arr){}';
        let model = [];
        parseFunctionDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"mergeSort","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"arr","Condition":"","Value":""}]'
        );
    });
    it('parseFunctionDeclaration Advanced Test 1', () => {
        let code = 'function mergeSort (arr){return arr[0]+1;}';
        let model = [];
        parseFunctionDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"mergeSort","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"arr","Condition":"","Value":""},' +
            '{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":"arr[0] + 1"}]'
        );
    });
    it('parseFunctionDeclaration Advanced Test 2', () => {
        let code = 'function mergeSort (arr){return ;}';
        let model = [];
        parseFunctionDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"mergeSort","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"arr","Condition":"","Value":""},' +
            '{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":""}]'
        );
    });
    it('parseVariableDeclaration Simple Test 1', () => {
        let code = 'let x;';
        let model = [];
        parseVariableDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"x","Condition":"","Value":""}]'
        );
    });
    it('parseVariableDeclaration Simple Test 1 With Assignment', () => {
        let code = 'var x = 5;';
        let model = [];
        parseVariableDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"x","Condition":"","Value":"5"}]'
        );
    });
    it('parseVariableDeclaration Simple Test 2', () => {
        let code = 'var y';
        let model = [];
        parseVariableDeclaration(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"y","Condition":"","Value":""}]'
        );
    });
    it('parseUpdateExpression Simple Test 1', () => {
        let code = 'num++;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"UpdateExpression","Name":"num","Condition":"","Value":"num + 1"}]'
        );
    });
    it('parseUpdateExpression Simple Test 2', () => {
        let code = '++num;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"UpdateExpression","Name":"num","Condition":"","Value":"num + 1"}]'
        );
    });
    it('parseUpdateExpression Simple Test 3', () => {
        let code = 'num--;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"UpdateExpression","Name":"num","Condition":"","Value":"num - 1"}]'
        );
    });
    it('parseUpdateExpression Simple Test 4', () => {
        let code = '--num;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"UpdateExpression","Name":"num","Condition":"","Value":"num - 1"}]'
        );
    });
    it('parseAssignmentExpression Simple Test', () => {
        let code = 'x=y+8;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"y + 8"}]'
        );
    });
    it('parseAssignmentExpression Simple Test +=', () => {
        let code = 'x+=10;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 10"}]'
        );
    });
    it('parseAssignmentExpression Simple Test -=', () => {
        let code = 'x-=15;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 15"}]'
        );
    });
    it('parseAssignmentExpression Advanced Test', () => {
        let code = 'x=(y+8)*3+4;';
        let model = [];
        parseExpressionStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"(y + 8) * 3 + 4"}]'
        );
    });
    it('parseIfStatement Simple Test Without Else', () => {
        let code = 'if(x<3){}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""}]'
        );
    });
    it('parseIfStatement Simple Test With Else', () => {
        let code = 'if(x<3){}else{}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""}]'
        );
    });
    it('parseIfStatement Advanced Test With Else', () => {
        let code = 'if(x<3){x=x+2;}else{x=x-2;}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"}]'
        );
    });
    it('parseIfStatement Advanced Test With Else', () => {
        let code = 'if(x<3) x=x+2; else x=x-2;';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"}]'
        );
    });
    it('parseIfStatement Advanced Test With IfElse', () => {
        let code = 'if(x<3){x=x+2;}else if(x>3){x=x-2;}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x > 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"}]'
        );
    });
    it('parseIfStatement Advanced Test With IfElse', () => {
        let code = 'if(x<3) x=x+2; else if(x>3) x=x-2;';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x > 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"}]'
        );
    });
    it('parseIfStatement Advanced Test With IfElse And Else', () => {
        let code = 'if(x<3){x=x+2;}else if(x>3){x=x-2;}else{x=x*x;}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x > 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"},' +
            '{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x * x"}]'
        );
    });
    it('parseIfStatement Advanced Test With IfElse And Else', () => {
        let code = 'if(x<3){x=x+2;}else if(x>3){x=x-2;}else if(x==22){x=x*x;}';
        let model = [];
        parseIfStatement(esprima.parseScript(code, {loc: true}).body[0], model);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x > 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x == 22","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x * x"}]'
        );
    });
    it('parseIfStatement Advanced Test With IfElse And Else', () => {
        let code = 'if(x<3){x=x+2;}else if(x>3){x=x-2;}else if(x==22){x=x*x;}';
        let model = parseCode(code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"x < 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x + 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x > 3","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x - 2"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"x == 22","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"x * x"}]'
        );
    });
    it('Total Test', () => {
        let code = 'function binarySearch(X, V, n){ let low, high, mid; low = 0; high = n - 1; while (low <= high) { mid = (low + high)/2; if (X < V[mid]) high = mid - 1; else if (X > V[mid]) low = mid + 1; else return mid; } return -1; }';
        let model = parseCode(code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"X","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"V","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"n","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"low","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"high","Condition":"","Value":""},' +
            '{"Line":1,"Type":"VariableDeclaration","Name":"mid","Condition":"","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"0"},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"n - 1"},' +
            '{"Line":1,"Type":"WhileStatement","Name":"","Condition":"low <= high","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"mid","Condition":"","Value":"(low + high) / 2"},' +
            '{"Line":1,"Type":"IfStatement","Name":"","Condition":"X < V[mid]","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"mid - 1"},' +
            '{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"X > V[mid]","Value":""},' +
            '{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"mid + 1"},' +
            '{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},' +
            '{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":"mid"},' +
            '{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":"-1"}]'
        );
    });
});