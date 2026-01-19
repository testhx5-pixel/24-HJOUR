
              const editor2 = document.getElementById('editor2');

              function exec(cmd) { document.execCommand(cmd, false, null); editor2.focus(); }
              function applyTextColor(color) { document.execCommand('foreColor', false, color); editor2.focus(); }
              function applyBgColor(color) { document.execCommand('hiliteColor', false, color) || document.execCommand('backColor', false, color); editor2.focus(); }
              function removeColors() {
                const sel = window.getSelection(); if (!sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                const content = range.cloneContents();
                const div = document.createElement('div'); div.appendChild(content);
                function clean(node) { if (node.nodeType === 1) { node.removeAttribute('style'); Array.from(node.childNodes).forEach(clean); } }
                clean(div);
                range.deleteContents();
                const frag = document.createDocumentFragment(); while (div.firstChild) frag.appendChild(div.firstChild); range.insertNode(frag); editor2.normalize(); editor2.focus();
              }
              function setFontSize(size) {
                if (!size) return;
                document.execCommand("fontSize", false, "7");
                const spans = editor2.querySelectorAll("font[size='7']");
                spans.forEach(s => { s.removeAttribute("size"); s.style.fontSize = size; });
              }
              function insertLink() {
                const url = prompt("Enter URL:");
                if (url) document.execCommand('createLink', false, url);
                editor2.focus();
              }
              function removeAllFormatting() {
                document.execCommand('removeFormat', false, null);
                editor2.querySelectorAll('a, ul, ol, li, font, u, i, b').forEach(e => {
                  const parent = e.parentNode;
                  while (e.firstChild) parent.insertBefore(e.firstChild, e);
                  parent.removeChild(e);
                });
                editor2.focus();
              }
              function setHeading(tag) {
                if (tag) document.execCommand('formatBlock', false, tag);
                editor2.focus();
              }
                    function syncEditor() {
              const editor = document.getElementById('editor2');
              const hidden = document.getElementById('hiddenDesc2');
              if (editor && hidden) hidden.value = editor.innerHTML;
            }

            const foorm = document.getElementById('addForm');
            if (foorm) {
              foorm.addEventListener('submit', (e) => {
                syncEditor();
              });
            }
