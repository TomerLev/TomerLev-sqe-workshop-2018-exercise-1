import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let model = parseCode(codeToParse);
        $('#modelTable').append(makeTableHTML(model));
    });
});

function makeTableHTML(model) {
    let result = '';
    for (let i = 0; i < model.length; i++) {
        result += '<tr>';
        result += '<td>' + model[i].Line + '</td>';
        result += '<td>' + model[i].Type + '</td>';
        result += '<td>' + model[i].Name + '</td>';
        result += '<td>' + model[i].Condition + '</td>';
        result += '<td>' + model[i].Value + '</td>';
        result += '</tr>';
    }
    return result;
}