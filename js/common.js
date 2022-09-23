window.alert = function (content) {
    const modal = document.getElementById('alert');
    modal.querySelector('.show-content').innerHTML = content;
    (new bootstrap.Modal(modal, {keyboard: false})).show();
}

function inArray (value, array) {
    for (let i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return true;
        }
    }
    return false;
}

function transformToNode (html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.children[0];
}

function downloadFile (fileName, fileContent) {
    const file = new File([fileContent], fileName, {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

function regExec (reg, string, callback) {
    let result = reg.exec(string);
    while (result !== null) {
        callback(result);
        result = reg.exec(string);
    }
}