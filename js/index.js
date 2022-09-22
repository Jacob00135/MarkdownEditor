(function (window, document) {
    'use strict';

    class ResponsiveEditor {
        static mainBox = document.getElementById('main');
        static editorPanel = document.getElementById('editor-panel');
        static renderTimer = null;  // 节流阀
        static lastRenderTime = +new Date();

        static resizeHeight () {
            ResponsiveEditor.mainBox.style.height = (window.innerHeight - 50 - 16 - 12) + 'px';
        }

        static renderMarkdown () {
            strapdown.renderMarkdown(ResponsiveEditor.editorPanel);
            ResponsiveEditor.lastRenderTime = +new Date();
        }
    }

    class OpenMarkdownFile {
        static newFileButton = document.getElementById('create-new-file')
        static topNewFileButton = document.querySelector('#top-button-group .create-new-file');
        static openFile = document.querySelector('#open-file input[type="file"]');
        static topOpenFile = document.querySelector('#top-button-group .open-file');
        static fileName = '';

        static readFileContent(e) {
            // 异常情况检查
            const input = e.target;
    
            if (input.files.length <= 0) {
                return undefined;
            }
    
            const file = input.files[0];
    
            if (file.name.indexOf('.') < 0) {
                alert('必须选择Markdown格式文件！');
                return undefined;
            }
            if (file.name.split('.').pop() !== 'md') {
                alert('必须选择Markdown格式文件！');
                return undefined;
            }

            OpenMarkdownFile.fileName = file.name;
    
            // 读取文件内容
            const reader = new FileReader();
            reader.addEventListener('loadend', function (e) {
                if (e.target.readyState == FileReader.DONE) {
                    const fileContent = e.target.result;
    
                    // 隐藏初始面板
                    document.querySelector('#init-panel').classList.add('d-none');
    
                    // 显示编辑器与阅读器
                    document.querySelector('#editor-panel').classList.remove('d-none');
                    document.querySelector('#editor-panel .markdown-edit').value = fileContent;
                    ResponsiveEditor.renderMarkdown();

                    // 显示顶部按钮组
                    document.getElementById('top-button-group').classList.remove('d-none');
                }
            });
            reader.readAsText(file);
        }

        static createNewFile (e) {
            OpenMarkdownFile.fileName = 'NewMarkdown.md';

            // 隐藏初始面板
            document.querySelector('#init-panel').classList.add('d-none');
    
            // 显示编辑器与阅读器
            document.querySelector('#editor-panel').classList.remove('d-none');
            document.querySelector('#editor-panel .markdown-edit').value = '';
            ResponsiveEditor.renderMarkdown();

            // 显示顶部按钮组
            document.getElementById('top-button-group').classList.remove('d-none');
        }
    }

    class editorMode {
        static onlyEdit = document.getElementById('only-edit');
        static onlyRead = document.getElementById('only-read');

        static onlyEditMode (e) {
            const btn = editorMode.onlyEdit;

            if (inArray('active', btn.classList)) {
                btn.classList.remove('active');
                document.querySelector('#editor-panel .markdown-preview').classList.remove('d-none');
            } else {
                document.querySelector('#editor-panel .markdown-preview').classList.add('d-none');
                document.querySelector('#editor-panel .markdown-edit').classList.remove('d-none');
                editorMode.onlyRead.classList.remove('active');
                btn.classList.add('active');
            }
        }

        static onlyReadMode (e) {
            const btn = editorMode.onlyRead;

            if (inArray('active', btn.classList)) {
                btn.classList.remove('active');
                document.querySelector('#editor-panel .markdown-edit').classList.remove('d-none');
            } else {
                document.querySelector('#editor-panel .markdown-edit').classList.add('d-none');
                document.querySelector('#editor-panel .markdown-preview').classList.remove('d-none');
                editorMode.onlyEdit.classList.remove('active');
                btn.classList.add('active');
            }
        }
    }

    function main () {
        // 新建按钮点击事件
        OpenMarkdownFile.newFileButton.addEventListener('click', OpenMarkdownFile.createNewFile);
        OpenMarkdownFile.topNewFileButton.addEventListener('click', OpenMarkdownFile.createNewFile);

        // 监听选择文件事件
        OpenMarkdownFile.openFile.addEventListener('input', OpenMarkdownFile.readFileContent);
        OpenMarkdownFile.topOpenFile.addEventListener('input', OpenMarkdownFile.readFileContent);

        // 响应式的编辑器大小
        ResponsiveEditor.resizeHeight();
        window.addEventListener('resize', function (e) {
            ResponsiveEditor.resizeHeight();
        });

        // 监听编辑器内容改变事件
        document.querySelector('#editor-panel .markdown-edit').addEventListener('input', function (e) {
            clearTimeout(ResponsiveEditor.renderTimer);

            if (+new Date() - ResponsiveEditor.lastRenderTime > 3000) {
                ResponsiveEditor.renderMarkdown();
                return undefined;
            }

            ResponsiveEditor.renderTimer = setTimeout(function () {
                ResponsiveEditor.renderMarkdown();
            }, 500);
        });

        // 监听“仅编辑”和“仅阅读”按钮点击事件
        editorMode.onlyEdit.querySelector('i').addEventListener('click', editorMode.onlyEditMode);
        editorMode.onlyRead.querySelector('i').addEventListener('click', editorMode.onlyReadMode);

        // 下载按钮点击事件
        document.getElementById('download').addEventListener('click', function (e) {
            downloadFile(
                OpenMarkdownFile.fileName,
                document.querySelector('#editor-panel .markdown-edit').value
            );
        });

        // 导出按钮点击事件
        document.getElementById('export-html').addEventListener('click', function (e) {
            // html模板
            const htmlTemplate = `<!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>{{ title }}</title>
                <style>
                    body {
                        background-color: #f4f4f4;
                    }
                    {{ css }}
                </style>
            </head>
            <body>
                {{ body }}
            </body>
            </html>`;

            // 获取title
            const title = OpenMarkdownFile.fileName.slice(0, OpenMarkdownFile.fileName.length - 3);

            // 获取body
            const body = document.querySelector('#editor-panel .markdown-preview').innerHTML;

            // 获取css
            // TODO 待实现：获取bootstrap.min.css和strapdown.css文件内容
            const css = '';

            // 导出html文件
            const html = htmlTemplate.replace('{{ title }}', title)
                                     .replace('{{ css }}', css)
                                     .replace('{{ body }}', body);
            console.log(html);
            // downloadFile(title + '.html', html);
        });
    }

    main();
})(window, document);