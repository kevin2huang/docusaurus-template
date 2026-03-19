const WRAP_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-wrap-icon lucide-text-wrap"><path d="m16 16-3 3 3 3"/><path d="M3 12h14.5a1 1 0 0 1 0 7H13"/><path d="M3 19h6"/><path d="M3 5h18"/></svg>';

const COPY_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

const CHECK_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function enhanceCodeBlocks() {
  const preElements = document.querySelectorAll('pre');

  preElements.forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    if (pre.parentElement && pre.parentElement.classList.contains('code-block-enhanced')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-enhanced';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const buttonBar = document.createElement('div');
    buttonBar.className = 'code-block-buttons';

    // Word wrap toggle button
    const wrapBtn = document.createElement('button');
    wrapBtn.className = 'code-block-btn';
    wrapBtn.title = 'Toggle word wrap';
    wrapBtn.innerHTML = WRAP_ICON;
    wrapBtn.addEventListener('click', () => {
      pre.classList.toggle('wrap');
      code.classList.toggle('wrap');
      wrapBtn.classList.toggle('active');
    });

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-block-btn';
    copyBtn.title = 'Copy code';
    copyBtn.innerHTML = COPY_ICON;
    copyBtn.addEventListener('click', () => {
      const text = code.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = CHECK_ICON;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });

    buttonBar.appendChild(wrapBtn);
    buttonBar.appendChild(copyBtn);
    wrapper.appendChild(buttonBar);
  });
}

export function onRouteDidUpdate() {
  setTimeout(enhanceCodeBlocks, 100);
}
