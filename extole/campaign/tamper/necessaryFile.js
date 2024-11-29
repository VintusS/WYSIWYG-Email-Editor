// ==UserScript==
// @name         WYSIWYG Integration with Download Button and Update Variable
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Replaces in email-render.js
// @author       You
// @match        https://my.extole.com/programs?client_id=1890234003
// @icon         https://www.google.com/s2/favicons?sz=64&domain=extole.com
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    let downloadButton;

    function loadJSZip() {
        return new Promise((resolve, reject) => {
            const jszipScript = document.createElement('script');
            jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
            jszipScript.onload = resolve;
            jszipScript.onerror = reject;
            document.head.appendChild(jszipScript);
        });
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    function updateButtons() {
        const toolbar = document.querySelector('.creative-preview-toolbar__right__links');

        if (!toolbar) {
            setTimeout(updateButtons, 1000);
            return;
        }

        if (!downloadButton) {
            downloadButton = document.createElement('a');
            downloadButton.innerHTML = '<span>Download and Modify Zip</span>';
            downloadButton.style.marginLeft = '10px';
            downloadButton.addEventListener("click", handleDownloadClick);
        }

        if (!toolbar.contains(downloadButton)) {
            toolbar.prepend(downloadButton);
        }
    }

    function observeUrlChange() {
        let lastUrl = window.location.href;

        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updateButtons();
            }
        });

        observer.observe(document, { subtree: true, childList: true });
    }

    async function handleDownloadClick() {
        downloadButton.innerHTML = '<span>Loading...</span>';
        downloadButton.appendChild(spinner);

        const currentUrl = window.location.href;
        const campaignIdMatch = currentUrl.match(/\/(\d+)\/assets/);
        const campaignId = campaignIdMatch ? campaignIdMatch[1] : null;
        const componentElement = document.querySelector('span[component-id]');
        const componentId = componentElement ? componentElement.getAttribute('component-id') : null;
        const lastNumberSet = currentUrl.match(/\/(\d+)(?=\D*$)/);
        const actionId = lastNumberSet ? lastNumberSet[1] : null;

        if (campaignId && componentId) {
            const downloadLinkElement = document.querySelector(`a[href*="/actions/creatives/${actionId}"][href$=".zip"]`);
            const zipUrl = downloadLinkElement ? downloadLinkElement.href : null;

            if (zipUrl) {
                await loadJSZip();

                const templateHtml = await fetchCampaignVariables(campaignId, componentId);
                if (templateHtml) {
                    await downloadAndModifyZip(templateHtml, zipUrl);
                } else {
                    alert('No template_html variable found.');
                }
            }
        }

        resetButton();
    }

    async function fetchCampaignVariables(campaignId, componentId) {
        const accessToken = await fetchAccessToken();
        const response = await fetch(`https://my.extole.com/v2/campaigns/${campaignId}/components/${componentId}/variables`, {
            method: 'GET',
            headers: { 'Authorization': accessToken }
        });
        const data = await response.json();
        const templateHtmlVar = data.find(variable => variable.name === 'template_html');
        return templateHtmlVar ? templateHtmlVar.values.default : null;
    }

    async function downloadAndModifyZip(templateHtml, zipUrl) {
        const response = await fetch(zipUrl);
        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        const emailRenderFile = Object.keys(zip.files).find(f => f.endsWith('email-render.js'));

        if (!emailRenderFile) {
            alert('email-render.js not found in the ZIP file.');
            resetButton();
            return;
        }

        const content = await zip.file(emailRenderFile).async("string");

        const updatedContent = content.replace(
            /var emailBody = templateService\.loadEncoderService\(context\)\.render\(template, resolvedVariables\);/,
            `var final_template = resolvedVariables.template_html ? resolvedVariables.template_html : template;
             var emailBody = templateService.loadEncoderService(context).render(final_template, resolvedVariables);`
        );

        zip.file(emailRenderFile, updatedContent);

        const modifiedBlob = await zip.generateAsync({ type: "blob" });

        await uploadModifiedZip(modifiedBlob, zipUrl);
    }

    async function uploadModifiedZip(modifiedBlob, originalUrl) {
        const accessToken = await fetchAccessToken();
        const formData = new FormData();
        formData.append('file', modifiedBlob, 'modified.zip');
        await fetch(originalUrl.replace('.zip', ''), {
            method: 'POST',
            headers: { 'Authorization': accessToken },
            body: formData
        });
        alert('File uploaded successfully!');
    }

    async function fetchAccessToken() {
        const response = await fetch('https://my.extole.com/api/v4/tokens');
        const data = await response.json();
        return data.access_token;
    }

    function resetButton() {
        downloadButton.innerHTML = '<span>Download and Modify Zip</span>';
    }

    window.onload = function () {
        updateButtons();
        observeUrlChange();
    };
})();
