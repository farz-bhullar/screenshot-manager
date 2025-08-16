const screenshotManager = new ScreenshotManager({
  screenshotConfigs: [],
  onSuccess: (blob, id, config) => {
    console.log(`✅ Screenshot succeeded: ${id}`, config);
    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    // Open in new tab on click
    img.addEventListener('click', () => {
      window.open(url, '_blank');
    });
    document.getElementById('screenshots').appendChild(img);
  },
  onError: (error, id, config) => console.error(`❌ Screenshot failed: ${id}`, error, config)
});

function getSectionRect(id) {
  const rect = document.getElementById(id).getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height
  };
}

document.getElementById('manualCoordsCapture').addEventListener('click', () => {
  const input = document.getElementById('manualCoords').value.trim();
  if (!input) return alert('Please enter coordinates!');

  const parts = input.split(',').map(p => parseInt(p.trim()));
  if (parts.length !== 4 || parts.some(isNaN)) return alert('Invalid input! Enter x,y,width,height as numbers.');

  const [x, y, width, height] = parts;

  screenshotManager.captureOnce(
    { type: 'section', x, y, width, height },
    `manualCoords-${Date.now()}`
  );
});

document.getElementById('manualFull').addEventListener('click', () => {
  screenshotManager.captureOnce({ type: 'full' });
});

document.getElementById('manualSection1').addEventListener('click', () => {
  screenshotManager.captureOnce({ type: 'section', ...getSectionRect('section1') }, 'manualSection1');
});

document.getElementById('manualSection2').addEventListener('click', () => {
  screenshotManager.captureOnce({ type: 'section', ...getSectionRect('section2') }, 'manualSection2');
});

document.getElementById('manualSection3').addEventListener('click', () => {
  screenshotManager.captureOnce({ type: 'section', ...getSectionRect('section3') }, 'manualSection3');
});

document.getElementById('startInterval').addEventListener('click', () => {
  screenshotManager.addOrUpdateScreenshotConfig('fullInterval', { type: 'full', interval: 10000 });
  ['section1','section2','section3'].forEach((id, i) => {
    screenshotManager.addOrUpdateScreenshotConfig(`sectionInterval${i+1}`, { type: 'section', ...getSectionRect(id), interval: 15000 + i*5000 });
  });
});

document.getElementById('stopInterval').addEventListener('click', () => {
  screenshotManager.stopAllScreenshots();
});

document.getElementById('clearScreenshots').addEventListener('click', () => {
  document.getElementById('screenshots').innerHTML = '';
});