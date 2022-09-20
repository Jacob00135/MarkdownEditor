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