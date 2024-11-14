// ==UserScript==
// @name         Novelpia Downloader
// @version      1.0
// @description  Reconstructs novels with a delay for page loading
// @author       null
// @match        https://novelpia.com/viewer/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const regex = /SmtrRWNTTmh[^\s\u3000\r\n]+/g;

  const show_text_button = document.createElement('button');
  show_text_button.textContent = "Show text";
  Object.assign(show_text_button.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: '9999',
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  });

  show_text_button.addEventListener('mouseover', () => {
    show_text_button.style.backgroundColor = '#45a049';
  });
  show_text_button.addEventListener('mouseout', () => {
    show_text_button.style.backgroundColor = '#4CAF50';
  });

  document.body.appendChild(show_text_button);

  const download_interface = document.createElement('div');
  Object.assign(download_interface.style, {
    position: 'fixed',
    bottom: '60px',
    right: '10px',
    zIndex: '9998',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'none',
    width: '320px',
  });

  const text_area = document.createElement('textarea');
  Object.assign(text_area.style, {
    width: '100%',
    height: '150px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  });
  text_area.readOnly = true;
  download_interface.appendChild(text_area);

  const download_button = document.createElement('button');
  download_button.textContent = "Download Text";
  Object.assign(download_button.style, {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  });

  download_button.addEventListener('mouseover', () => {
    download_button.style.backgroundColor = '#007B9E';
  });
  download_button.addEventListener('mouseout', () => {
    download_button.style.backgroundColor = '#008CBA';
  });

  download_interface.appendChild(download_button);
  document.body.appendChild(download_interface);

  function reconstruct_text() {
      const font_elements = document.querySelectorAll('font[id^="line_"]');

      if (font_elements.length > 0) {
          let reconstructed_text = [];
          font_elements.forEach(element => {
              if (element.tagName.toLowerCase() === 'font') {
                  const original_text = element.textContent;
                  const cleaned_text = original_text.replace(regex, '');
                  reconstructed_text.push(cleaned_text);
              }
          });
          return reconstructed_text.join(' ');
      } else {
          return "No element starting with 'line_' found";
      }
  }

  function sanitize_filename(name) {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').substring(0, 255);
  }

  // Hey you, how are you kekw
  function get_last_path_segment() {
    const pathSegments = window.location.pathname.split('/');
    let lastSegment = pathSegments.pop() || pathSegments.pop();
    if (!lastSegment) {
      lastSegment = 'reconstructed_text';
    }
    return sanitize_filename(lastSegment);
  }

  show_text_button.addEventListener('click', () => {
    if (download_interface.style.display === 'none') {
      setTimeout(() => {
        text_area.value = reconstruct_text();
        download_interface.style.display = 'block';
        show_text_button.textContent = "Hide Text";
      }, 1000);
    } else {
      download_interface.style.display = 'none';
      show_text_button.textContent = "Show Text";
    }
  });

  download_button.addEventListener('click', () => {
    const text = text_area.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const lastSegment = get_last_path_segment();
    const filename = `${lastSegment}.txt`;

    const download_link = document.createElement('a');
    download_link.href = url;
    download_link.download = filename;
    download_link.click();

    URL.revokeObjectURL(url);
  });
})();
