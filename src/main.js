// Entry point for Vite. Moved from inline script in index.html so it always executes.
// Minimal logging to verify execution.
console.log('[Dashboard] Script starting');
console.log('[Dashboard] main.js loaded');

// Expose functions needed by inline HTML onclicks, while keeping most code scoped.
(function(){
  let editingIdea = null;
  let editingTest = null;
  let completingTest = null;
  let creatingFromIdea = null;

  // Tab switching
  function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('text-potent-purple','border-b-2','border-potent-purple','bg-fearless-fuchsia/10');
      btn.classList.add('text-gray-600');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn){
      activeBtn.classList.add('text-potent-purple','border-b-2','border-potent-purple','bg-fearless-fuchsia/10');
      activeBtn.classList.remove('text-gray-600');
    }
  }

  // Modal helpers
  function openIdeaModal(ideaElement = null) {
    editingIdea = ideaElement;
    const modal = document.getElementById('idea-modal');
    const title = document.getElementById('idea-modal-title');
    if (ideaElement) {
      title.textContent = 'Edit Test Idea';
      const ideaData = getIdeaData(ideaElement);
      document.getElementById('idea-name').value = ideaData.name || '';
      document.getElementById('idea-element').value = ideaData.element || '';
      document.getElementById('idea-reasoning').value = ideaData.reasoning || '';
      document.getElementById('idea-howto').value = ideaData.howto || '';
      document.getElementById('idea-success').value = ideaData.success || '';
  // Keep existing screenshots if user doesn't re-upload
  window.pendingIdeaScreenshots = ideaData.screenshots || [];
    } else {
      title.textContent = 'Add New Test Idea';
      const form = document.getElementById('idea-form');
      if (form) form.reset();
  window.pendingIdeaScreenshots = [];
    }
    modal?.classList.add('active');
  }
  function closeIdeaModal(){
    document.getElementById('idea-modal')?.classList.remove('active');
    editingIdea = null;
  }

  function openTestModal(testElement = null) {
    editingTest = testElement;
    const modal = document.getElementById('test-modal');
    const title = document.getElementById('test-modal-title');
    if (testElement) {
      title.textContent = 'Edit Test';
      const testData = getTestData(testElement);
      document.getElementById('test-name').value = testData.name || '';
      document.getElementById('test-start-date').value = testData.startDate || '';
      document.getElementById('test-end-date').value = testData.endDate || '';
      document.getElementById('test-tester').value = testData.tester || '';
      document.getElementById('test-status').value = testData.status || '';
      document.getElementById('test-notes').value = testData.notes || '';
    } else {
      title.textContent = 'Create New Test';
      const form = document.getElementById('test-form');
      if (form) form.reset();
    }
    modal?.classList.add('active');
  }
  function closeTestModal(){
    document.getElementById('test-modal')?.classList.remove('active');
    editingTest = null;
  }

  function openCompleteModal(testElement){
    completingTest = testElement;
    const modal = document.getElementById('complete-modal');
    const testData = getTestData(testElement);
    const today = new Date().toISOString().split('T')[0];
    const endInput = document.getElementById('complete-end-date');
    if (endInput) endInput.value = testData.endDate || today;
    const resultsInput = document.getElementById('complete-results');
    if (resultsInput) resultsInput.value = testData.results || '';
    modal?.classList.add('active');
  }
  function closeCompleteModal(){
    document.getElementById('complete-modal')?.classList.remove('active');
    completingTest = null;
  }

  // Data helpers
  function getIdeaData(element){
    const container = element.closest('.bg-wellness-white');
    const screenshots = [];
    const screenshotElements = container?.querySelectorAll('.flex.gap-2.mt-1 img');
    screenshotElements?.forEach(img => {
      screenshots.push({
        name: img.alt || 'Screenshot',
        data: img.src
      });
    });
    return {
      name: container?.querySelector('h3')?.textContent?.trim() || '',
      element: container?.querySelector('.grid > div:nth-child(1) p')?.textContent?.trim() || '',
      reasoning: container?.querySelector('.grid > div:nth-child(2) p')?.textContent?.trim() || '',
      howto: container?.querySelector('.grid > div:nth-child(3) p')?.textContent?.trim() || '',
      success: container?.querySelector('.mt-2 p')?.textContent?.trim() || '',
      screenshots: screenshots
    };
  }
  function getTestData(element){
    const container = element.closest('.bg-white');
    return {
      name: container?.querySelector('h3')?.textContent?.trim() || '',
      startDate: container?.querySelector('.grid > div:nth-child(1) p')?.textContent?.trim() || '',
      endDate: container?.querySelector('.grid > div:nth-child(2) p')?.textContent?.trim() || '',
      tester: container?.querySelector('.grid > div:nth-child(3) p')?.textContent?.trim() || '',
      status: container?.querySelector('.inline-block.bg-yellow-100') ? 'in-progress' : (container?.querySelector('.inline-block.bg-green-100') ? 'completed' : 'planned'),
      notes: container?.querySelector('.mb-4 p')?.textContent?.trim() || '',
      results: container?.querySelector('.mb-4 p')?.textContent?.trim() || ''
    };
  }

  function addIdea(idea){
    const ideasList = document.getElementById('ideas-list');
    const ideaItem = document.createElement('div');
    ideaItem.className = 'bg-wellness-white rounded-lg p-4 border-l-4 border-potent-purple shadow-sm';
    if (idea.id) ideaItem.dataset.id = idea.id;
    let screenshotsHtml = '';
    if (idea.screenshots && idea.screenshots.length) {
      screenshotsHtml = '<div class="mt-2 idea-screenshots"><span class="font-medium text-mindful-midnight text-sm">Screenshots:</span><div class="flex gap-2 mt-1">';
      idea.screenshots.forEach(s => {
        screenshotsHtml += `<img src="${s.data}" alt="${s.name}" class="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-80" onclick="enlargeImage('${s.data}', '${s.name}')">`;
      });
      screenshotsHtml += '</div></div>';
    }
    ideaItem.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-mindful-midnight">${idea.name}</h3>
        <div class="flex gap-2">
          <button onclick="editIdea(this)" class="text-potent-purple hover:text-darker-violet text-sm">✏️ Edit</button>
          <button onclick="createTestFromIdea(this)" class="text-black hover:text-vitality-violet text-sm">🧪 Create Test</button>
          <button onclick="deleteIdea(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="font-medium text-mindful-midnight">Element:</span>
          <p class="text-gray-700">${idea.element}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Reasoning:</span>
          <p class="text-gray-700">${idea.reasoning}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">How to Test:</span>
          <p class="text-gray-700">${idea.howto}</p>
        </div>
      </div>
      <div class="mt-2">
        <span class="font-medium text-mindful-midnight text-sm">Success Criteria:</span>
        <p class="text-gray-700 text-sm">${idea.success}</p>
      </div>${screenshotsHtml}`;
  ideasList?.prepend(ideaItem);
  return ideaItem;
  }
  function editIdea(button){ openIdeaModal(button.closest('.bg-wellness-white')); }
  function deleteIdea(button){ button.closest('.bg-wellness-white')?.remove(); }
  function createTestFromIdea(button){
    const ideaData = getIdeaData(button.closest('.bg-wellness-white'));
    creatingFromIdea = button.closest('.bg-wellness-white');
    openTestModal();
    const name = document.getElementById('test-name');
    const notes = document.getElementById('test-notes');
    if (name) name.value = ideaData.name;
    if (notes) notes.value = `Created from idea: ${ideaData.reasoning}`;
    // Store screenshot data to be used when submitting the test
    window.pendingScreenshots = ideaData.screenshots;
  }

  async function addTest(test){
    const testsList = document.getElementById('tests-list');
    const testItem = document.createElement('div');
    testItem.className = 'bg-white rounded-lg p-6 border shadow-sm border-l-4 border-vitality-violet';
    let screenshotsHtml = '';
    if (test.screenshots && test.screenshots.length) {
      screenshotsHtml = '<div class="bg-wellness-white p-3 rounded mt-4"><span class="font-medium text-mindful-midnight text-sm">Screenshots:</span><div class="flex gap-2 mt-2">';
      test.screenshots.forEach(s => {
        screenshotsHtml += `<img src="${s.data}" alt="${s.name}" class="w-20 h-16 object-cover rounded">`;
      });
      screenshotsHtml += '</div></div>';
    }
    testItem.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-semibold text-mindful-midnight text-lg">${test.name}</h3>
          <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">In Progress</span>
        </div>
        <div class="flex gap-2">
          <button onclick="editTest(this)" class="text-potent-purple hover:text-darker-violet text-sm">✏️ Edit</button>
          <button onclick="completeTest(this)" class="text-tenacious-turquoise hover:text-vitality-violet text-sm">✅ Complete</button>
          <button onclick="deleteTest(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <span class="font-medium text-mindful-midnight">Start Date:</span>
          <p class="text-gray-700">${test.startDate}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Expected End:</span>
          <p class="text-gray-700">${test.endDate}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Tester:</span>
          <p class="text-gray-700">${test.tester}</p>
        </div>
      </div>
      <div class="mb-4">
        <span class="font-medium text-mindful-midnight">Notes:</span>
        <p class="text-gray-700">${test.notes}</p>
      </div>
      <div class="bg-wellness-white p-3 rounded">
        <span class="font-medium text-mindful-midnight text-sm">Screenshots:</span>
        <div class="mt-2 flex gap-2">
          ${test.screenshots && test.screenshots.length ? test.screenshots.map(s => 
            `<img src="${s.data}" alt="${s.name}" class="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-80" onclick="enlargeImage('${s.data}', '${s.name}')">`
          ).join('') : `
          <div class="bg-fearless-fuchsia/20 w-20 h-16 rounded flex items-center justify-center text-xs text-mindful-midnight">📱 Mobile</div>
          <div class="bg-fearless-fuchsia/20 w-20 h-16 rounded flex items-center justify-center text-xs text-mindful-midnight">💻 Desktop</div>
          `}
        </div>
      </div>`;
    testsList?.prepend(testItem);
  }
  function editTest(button){ openTestModal(button.closest('.bg-white')); }
  function deleteTest(button){ button.closest('.bg-white')?.remove(); }
  function completeTest(button){ openCompleteModal(button.closest('.bg-white')); }
  function viewTestResults(button){
    const testItem = button.closest('.bg-white');
    alert('Displaying test results for: ' + (testItem?.querySelector('h3')?.textContent || ''));
  }

  function enlargeImage(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-screen p-4">
        <img src="${src}" alt="${alt}" class="max-w-full max-h-full object-contain">
        <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-black hover:bg-gray-200">×</button>
      </div>
    `;
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    document.body.appendChild(modal);
  }

  // Helper to read File objects as data URLs (base64) for image previews/storage
  function readFilesAsDataURLs(files) {
    return Promise.all(Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
      });
    }));
  }

  // Compress a dataURL image using canvas to fit within maxEdge and quality
  function compressDataUrl(dataUrl, { maxEdge = 800, quality = 0.7 } = {}) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        // Use JPEG to shrink size; fallback to PNG if JPEG not supported
        const out = canvas.toDataURL('image/jpeg', quality);
        resolve(out);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // Fit screenshots to approximate Google Sheets cell limits by keeping one compressed image if needed
  async function fitScreenshotsForSheet(screenshots) {
    try {
      const LIMIT = 39000; // Keep well under server 40k truncation threshold

      // First, try with existing data
      let json = JSON.stringify(screenshots);
      if (json.length <= LIMIT) return json;

      // If too large, try compressing all images with progressively stronger settings
      const qualities = [0.7, 0.5, 0.3];
      const edges = [800, 600, 400];

      for (const maxEdge of edges) {
        for (const quality of qualities) {
          const compressedScreenshots = await Promise.all(
            screenshots.map(async (s) => ({
              name: s.name,
              data: await compressDataUrl(s.data, { maxEdge, quality }),
            }))
          );

          // Try with all images compressed
          json = JSON.stringify(compressedScreenshots);
          if (json.length <= LIMIT) {
            console.log(`[Dashboard] Screenshots compressed to fit. Edge: ${maxEdge}, Quality: ${quality}, Size: ${json.length}`);
            return json;
          }

          // If still too big, start removing images from the end
          let mutableScreenshots = [...compressedScreenshots];
          while (mutableScreenshots.length > 0) {
            json = JSON.stringify(mutableScreenshots);
            if (json.length <= LIMIT) {
              console.warn(`[Dashboard] Screenshots compressed and trimmed to ${mutableScreenshots.length} images to fit.`);
              return json;
            }
            mutableScreenshots.pop();
          }
        }
      }

      console.error('[Dashboard] Could not fit any screenshots even after compression.');
      return ''; // Could not fit even one compressed image
    } catch (e) {
      console.warn('Failed to fit screenshots for sheet:', e);
      return '';
    }
  }

  function parseIdeaDescription(description) {
    const lines = description.split('\n');
    const result = {
      element: '',
      reasoning: '',
      howto: '',
      success: '',
    };

    lines.forEach(line => {
      if (line.startsWith('Element: ')) {
        result.element = line.substring('Element: '.length).trim();
      } else if (line.startsWith('Reasoning: ')) {
        result.reasoning = line.substring('Reasoning: '.length).trim();
      } else if (line.startsWith('How to Test: ')) {
        result.howto = line.substring('How to Test: '.length).trim();
      } else if (line.startsWith('Success Criteria: ')) {
        result.success = line.substring('Success Criteria: '.length).trim();
      }
    });

    return result;
  }

  async function refreshIdeasList(){
    const ideasList = document.getElementById('ideas-list');
    if (ideasList) ideasList.innerHTML = '<div class="text-gray-500">Loading ideas…</div>';
    try {
      console.log('[Dashboard] Fetching /api/ideas');
      const resp = await fetch('/api/ideas', { cache: 'no-store', headers: { 'Accept': 'application/json' } });
      if (!resp.ok) throw new Error('Failed to fetch ideas');
      const rows = await resp.json();
      console.log('[Dashboard] Ideas response', rows);
      if (!Array.isArray(rows) || rows.length === 0) {
        if (ideasList){
          const empty = document.createElement('div');
          empty.className = 'text-gray-500';
          empty.textContent = 'No ideas yet. Add your first idea!';
          ideasList.appendChild(empty);
        }
        return;
      }
      if (ideasList) ideasList.innerHTML = '';
      for (const row of rows.filter(r => r.title && r.title.trim())){
        const parsed = parseIdeaDescription(row.description);
        let screenshots = [];
        if (row.screenshots) {
          try {
            // Check if data looks like valid JSON and isn't truncated
            if (row.screenshots.endsWith('...[truncated]')) {
              console.warn('Screenshots data was truncated due to size limits');
              screenshots = [{ name: 'Screenshot (truncated)', data: '' }];
            } else {
              screenshots = JSON.parse(row.screenshots);
            }
          } catch (e) {
            console.warn('Failed to parse screenshots for idea:', row.title, e);
          }
        }
        const idea = {
          id: row.id,
          name: row.title || 'Untitled',
          element: parsed.element,
          reasoning: parsed.reasoning,
          howto: parsed.howto,
          success: parsed.success,
          screenshots: screenshots,
        };
        addIdea(idea);
      }
    } catch (err) {
      console.error('Failed loading ideas:', err);
      if (ideasList){
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600';
        errorDiv.textContent = 'Failed to load ideas from the server.';
        ideasList.appendChild(errorDiv);
      }
    }
  }

  async function refreshActiveTests(){
    const testsList = document.getElementById('tests-list');
    if (testsList) testsList.innerHTML = '<div class="text-gray-500">Loading active tests…</div>';
    try {
      console.log('[Dashboard] Fetching /api/tests');
      const resp = await fetch('/api/tests', { cache: 'no-store', headers: { 'Accept': 'application/json' } });
      if (!resp.ok) throw new Error('Failed to fetch active tests');
      const rows = await resp.json();
      console.log('[Dashboard] Active tests response', rows);
      if (!Array.isArray(rows) || rows.length === 0) {
        if (testsList){
          const empty = document.createElement('div');
          empty.className = 'text-gray-500';
          empty.textContent = 'No active tests.';
          testsList.appendChild(empty);
        }
        return;
      }
      if (testsList) testsList.innerHTML = '';
      for (const row of rows.filter(r => r['Name'] && r['Name'].trim())){
        let screenshots = [];
        if (row['Screenshots']) {
          try {
            // Check if data looks like valid JSON and isn't truncated
            if (row['Screenshots'].endsWith('...[truncated]')) {
              console.warn('Screenshots data was truncated due to size limits');
              screenshots = [{ name: 'Screenshot (truncated)', data: '' }];
            } else {
              screenshots = JSON.parse(row['Screenshots']);
            }
          } catch (e) {
            console.warn('Failed to parse screenshots for test:', row['Name'], e);
          }
        }
        const test = {
          name: row['Name'] || 'Untitled Test',
          startDate: row['Start Date'] || '',
          endDate: row['Expected End Date'] || '',
          tester: row['Tester'] || '',
          notes: row['Notes'] || '',
          screenshots: screenshots,
        };
        addTest(test);
      }
    } catch (err) {
      console.error('Failed loading active tests:', err);
      if (testsList){
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600';
        errorDiv.textContent = 'Failed to load active tests from the server.';
        testsList.appendChild(errorDiv);
      }
    }
  }

  function addCompletedTestCard(test){
    const list = document.getElementById('completed-list');
    const item = document.createElement('div');
    item.className = 'bg-white rounded-lg p-6 border shadow-sm border-l-4 border-green-500';
    item.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-semibold text-mindful-midnight text-lg">${test.name}</h3>
          <div class="flex gap-2 mt-1">
            <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">${test.result || 'Completed'}</span>
            <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">Completed</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="viewTestResults(this)" class="text-potent-purple hover:text-darker-violet text-sm">📊 View Results</button>
          <button onclick="deleteTest(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <span class="font-medium text-mindful-midnight">Start Date:</span>
          <p class="text-gray-700">${test.startDate || ''}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">End Date:</span>
          <p class="text-gray-700">${test.endDate || ''}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Duration:</span>
          <p class="text-gray-700">${test.duration || ''}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Tester:</span>
          <p class="text-gray-700">${test.tester || ''}</p>
        </div>
      </div>
      <div class="mb-4">
        <span class="font-medium text-mindful-midnight">Test Results:</span>
        <p class="text-gray-700">${test.results || ''}</p>
      </div>
      ${test.screenshots && test.screenshots.length ? `
      <div class="bg-wellness-white p-3 rounded">
        <span class="font-medium text-mindful-midnight text-sm">Screenshots:</span>
        <div class="mt-2 flex gap-2">
          ${test.screenshots.map(s => 
            `<img src="${s.data}" alt="${s.name}" class="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-80" onclick="enlargeImage('${s.data}', '${s.name}')">`
          ).join('')}
        </div>
      </div>` : ''}`;
    list?.appendChild(item);
  }

  async function refreshCompletedTests(){
    const completedList = document.getElementById('completed-list');
    if (completedList) completedList.innerHTML = '<div class="text-gray-500">Loading completed tests…</div>';
    try {
      console.log('[Dashboard] Fetching /api/tests?status=completed');
      const resp = await fetch('/api/tests?status=completed', { cache: 'no-store', headers: { 'Accept': 'application/json' } });
      if (!resp.ok) throw new Error('Failed to fetch completed tests');
      const rows = await resp.json();
      console.log('[Dashboard] Completed tests response', rows);
      if (!Array.isArray(rows) || rows.length === 0) {
        if (completedList){
          const empty = document.createElement('div');
          empty.className = 'text-gray-500';
          empty.textContent = 'No completed tests.';
          completedList.appendChild(empty);
        }
        return;
      }
      if (completedList) completedList.innerHTML = '';
      for (const row of rows.filter(r => r['Name'] && r['Name'].trim())){
        let screenshots = [];
        if (row['Screenshots']) {
          try {
            // Check if data looks like valid JSON and isn't truncated
            if (row['Screenshots'].endsWith('...[truncated]')) {
              console.warn('Screenshots data was truncated due to size limits');
              screenshots = [{ name: 'Screenshot (truncated)', data: '' }];
            } else {
              screenshots = JSON.parse(row['Screenshots']);
            }
          } catch (e) {
            console.warn('Failed to parse screenshots for completed test:', row['Name'], e);
          }
        }
        const test = {
          name: row['Name'] || 'Untitled Test',
          startDate: row['Start Date'] || '',
          endDate: row['End Date'] || '',
          tester: row['Tester'] || '',
          result: row['Result'] || 'Completed',
          results: row['Results'] || '',
          screenshots: screenshots,
        };
        addCompletedTestCard(test);
      }
    } catch (err) {
      console.error('Failed loading completed tests:', err);
      if (completedList){
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600';
        errorDiv.textContent = 'Failed to load completed tests from the server.';
        completedList.appendChild(errorDiv);
      }
    }
  }

  // Form handlers
  document.getElementById('idea-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const screenshotsInput = document.getElementById('idea-screenshots');
    const screenshots = screenshotsInput?.files || [];
    let screenshotData = await readFilesAsDataURLs(screenshots);
    if (screenshotData.length === 0 && window.pendingIdeaScreenshots && editingIdea) {
      screenshotData = window.pendingIdeaScreenshots;
    }
    const idea = {
      name: document.getElementById('idea-name')?.value.trim(),
      submitter: document.getElementById('idea-submitter')?.value.trim(),
      element: document.getElementById('idea-element')?.value.trim(),
      reasoning: document.getElementById('idea-reasoning')?.value.trim(),
      howto: document.getElementById('idea-howto')?.value.trim(),
      success: document.getElementById('idea-success')?.value.trim(),
      screenshots: screenshotData,
    };
    const description = [
      idea.element && `Element: ${idea.element}`,
      idea.reasoning && `Reasoning: ${idea.reasoning}`,
      idea.howto && `How to Test: ${idea.howto}`,
      idea.success && `Success Criteria: ${idea.success}`,
    ].filter(Boolean).join('\n');
  const screenshotsJson = idea.screenshots.length ? await fitScreenshotsForSheet(idea.screenshots) : '';
    try {
      // If editing, use PUT and include the idea ID from the DOM
      const isEditing = !!editingIdea;
      const endpoint = '/api/ideas';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = {
        title: idea.name,
        description,
        screenshots: screenshotsJson,
        submittedBy: idea.submitter || undefined,
      };
      if (isEditing) {
        const id = editingIdea.closest('.bg-wellness-white')?.dataset?.id;
        if (id) payload.id = id;
      }
      console.log('[Dashboard] Saving idea. Payload:', payload); // DEBUG
      const resp = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok){
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save idea');
      }
      const data = await resp.json().catch(() => ({}));
      if (editingIdea){
        const container = editingIdea.closest('.bg-wellness-white');
        container.querySelector('h3').textContent = idea.name;
        container.querySelector('.grid > div:nth-child(1) p').textContent = idea.element;
        container.querySelector('.grid > div:nth-child(2) p').textContent = idea.reasoning;
        container.querySelector('.grid > div:nth-child(3) p').textContent = idea.howto;
        container.querySelector('.mt-2 p').textContent = idea.success;
        // Update screenshots section
        let shots = container.querySelector('.idea-screenshots .flex.gap-2');
        if (!shots && idea.screenshots.length) {
          const wrapper = document.createElement('div');
          wrapper.className = 'mt-2 idea-screenshots';
          wrapper.innerHTML = '<span class="font-medium text-mindful-midnight text-sm">Screenshots:</span><div class="flex gap-2 mt-1"></div>';
          container.appendChild(wrapper);
          shots = wrapper.querySelector('.flex.gap-2');
        }
        if (shots) {
          shots.innerHTML = '';
          idea.screenshots.forEach(s => {
            const img = document.createElement('img');
            img.src = s.data; img.alt = s.name; img.className = 'w-20 h-16 object-cover rounded cursor-pointer hover:opacity-80';
            img.onclick = () => enlargeImage(s.data, s.name);
            shots.appendChild(img);
          });
        }
      } else {
        const el = addIdea(idea);
        if (data && data.id) el.dataset.id = data.id;
      }
  window.pendingIdeaScreenshots = [];
  closeIdeaModal();
    } catch (err){
      console.error('Save idea failed:', err);
      alert('Failed to save idea to Google Sheet. Please try again.');
    }
  });

  document.getElementById('test-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const screenshotsInput = document.getElementById('test-screenshots');
    const screenshots = screenshotsInput?.files || [];
    let screenshotData = await readFilesAsDataURLs(screenshots);
    
    // If no new screenshots were uploaded but we have pending screenshots from an idea, use those
    if (screenshotData.length === 0 && window.pendingScreenshots) {
      screenshotData = window.pendingScreenshots;
    }
    
    const test = {
      name: document.getElementById('test-name')?.value,
      startDate: document.getElementById('test-start-date')?.value,
      endDate: document.getElementById('test-end-date')?.value,
      tester: document.getElementById('test-tester')?.value,
      status: document.getElementById('test-status')?.value,
      notes: document.getElementById('test-notes')?.value,
      screenshots: screenshotData,
    };
    try {
      const screenshotsJsonForTest = test.screenshots.length ? await fitScreenshotsForSheet(test.screenshots) : '';
      const payload = {
        name: test.name,
        startDate: test.startDate,
        expectedEndDate: test.endDate,
        tester: test.tester,
        status: test.status,
        notes: test.notes,
        screenshots: screenshotsJsonForTest,
      };
      console.log('[Dashboard] Saving test. Payload:', payload); // DEBUG
      const resp = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok){
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save test');
      }
      if (editingTest){
        const container = editingTest.closest('.bg-white');
        container.querySelector('h3').textContent = test.name;
        container.querySelector('.grid > div:nth-child(1) p').textContent = test.startDate;
        container.querySelector('.grid > div:nth-child(2) p').textContent = test.endDate;
        container.querySelector('.grid > div:nth-child(3) p').textContent = test.tester;
        container.querySelector('.mb-4 p').textContent = test.notes;
      } else {
        addTest(test);
      }
      if (creatingFromIdea) {
        creatingFromIdea.remove();
        creatingFromIdea = null;
      }
      // Clear pending screenshots
      window.pendingScreenshots = null;
      closeTestModal();
    } catch (err){
      console.error('Save test failed:', err);
      alert('Failed to save test to Google Sheet.');
    }
  });

  document.getElementById('complete-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  const result = document.getElementById('complete-result')?.value;
  const endDate = document.getElementById('complete-end-date')?.value;
  const resultsText = document.getElementById('complete-results')?.value;
    if (completingTest){
      const container = completingTest.closest('.bg-white');
      const statusContainer = container.querySelector('.inline-block.bg-yellow-100');
      if (statusContainer) statusContainer.remove();
      const statusSpan = document.createElement('span');
      statusSpan.className = result === 'passed' ? 'inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium' : 'inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium';
      statusSpan.textContent = result === 'passed' ? '✅ Passed' : '❌ Failed';
      container.querySelector('.flex.gap-2').before(statusSpan);
      container.querySelector('.grid > div:nth-child(2) p').textContent = endDate;
      const resultsDiv = document.createElement('div');
      resultsDiv.className = 'mb-4';
      resultsDiv.innerHTML = `
        <span class="font-medium text-mindful-midnight">Test Results:</span>
        <p class="text-gray-700">${resultsText}</p>`;
      const existingResults = container.querySelector('.mb-4:last-child');
      if (existingResults){ existingResults.replaceWith(resultsDiv); } else { container.appendChild(resultsDiv); }
      
      // Extract screenshot data from the test
      const screenshotElements = container.querySelectorAll('.bg-wellness-white img');
      const screenshots = Array.from(screenshotElements).map(img => ({
        name: img.alt || 'Screenshot',
        data: img.src
      }));
      
      try {
        // Fit screenshots for Google Sheets size limits before sending
        const screenshotsJson = screenshots.length ? await fitScreenshotsForSheet(screenshots) : '';
        const payload = {
          name: container.querySelector('h3')?.textContent,
          startDate: container.querySelector('.grid > div:nth-child(1) p')?.textContent,
          endDate,
          tester: container.querySelector('.grid > div:nth-child(3) p')?.textContent,
          result: result === 'passed' ? 'Passed' : 'Failed',
          results: resultsText,
          screenshots: screenshotsJson,
        };
        console.log('[Dashboard] Completing test. Payload:', payload); // DEBUG
        await fetch('/api/complete-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err){
        console.error('Record completion failed:', err);
      }
    }
    closeCompleteModal();
  });

  // Initial load - wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    refreshIdeasList();
    refreshActiveTests();
    refreshCompletedTests();
  });

  // Make functions available to inline onclick attributes
  Object.assign(window, {
    switchTab,
    openIdeaModal,
    closeIdeaModal,
    openTestModal,
    closeTestModal,
    openCompleteModal,
    closeCompleteModal,
    editIdea,
    deleteIdea,
    createTestFromIdea,
    editTest,
    deleteTest,
    completeTest,
    viewTestResults,
    enlargeImage,
    readFilesAsDataURLs,
  });
})();
