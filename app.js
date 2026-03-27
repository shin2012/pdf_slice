// Configure pdf.js worker with fallback
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    // Fallback: Check if CDN worker loads successfully (simple existence check not easy, but we can set up local fallback as alternative)
    // In many environments, using local worker is safer if CDN might be blocked.
    // For now, let's detect if we are using local pdf.min.js and use local worker accordingly.
}

// Function to ensure worker is loaded (called before first usage)
async function ensureWorker() {
    try {
        // Try pinging the CDN worker, if it fails or if we are in local mode, use local
        const response = await fetch(pdfjsLib.GlobalWorkerOptions.workerSrc, { method: 'HEAD' });
        if (!response.ok) throw new Error();
    } catch (e) {
        console.warn('CDN Worker failed, switching to local worker.');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    }
}

// DOM Elements
const uploadZone = document.getElementById('upload-zone');
const pdfUpload = document.getElementById('pdf-upload');
const workspace = document.getElementById('workspace');
const filenameEl = document.getElementById('filename');
const fileMetaEl = document.getElementById('file-meta');
const pageGrid = document.getElementById('page-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingText = document.getElementById('loading-text');

const btnSelectAll = document.getElementById('btn-select-all');
const btnDeselectAll = document.getElementById('btn-deselect-all');
const btnDownload = document.getElementById('btn-download');
const btnReset = document.getElementById('btn-reset');
const selectedCountEl = document.getElementById('selected-count');

// State
let currentPdfBytes = null;
let totalPages = 0;
let selectedPages = new Set();
let originalFileName = '';

// Max file size for warning (50MB)
const MAX_FILE_SIZE_WARNING = 50 * 1024 * 1024;

// Events - Upload
uploadZone.addEventListener('click', () => pdfUpload.click());
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});
pdfUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Events - Actions
btnSelectAll.addEventListener('click', () => {
    const cards = document.querySelectorAll('.page-card');
    cards.forEach(card => {
        card.classList.add('selected');
        const pageNum = parseInt(card.dataset.page);
        selectedPages.add(pageNum);
    });
    updateDownloadButton();
});

btnDeselectAll.addEventListener('click', () => {
    const cards = document.querySelectorAll('.page-card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    selectedPages.clear();
    updateDownloadButton();
});

btnReset.addEventListener('click', resetWorkspace);

btnDownload.addEventListener('click', generateAndDownloadPDF);

// Functions
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
    }

    if (file.size > MAX_FILE_SIZE_WARNING) {
        const proceed = confirm(`파일 크기가 큽니다 (${formatBytes(file.size)}). 기기 성능에 따라 로딩이 지연되거나 브라우저가 멈출 수 있습니다. 계속하시겠습니까?`);
        if (!proceed) {
            pdfUpload.value = '';
            return;
        }
    }

    originalFileName = file.name;
    const fileSizeStr = formatBytes(file.size);
    
    uploadZone.classList.add('hidden');
    workspace.classList.remove('hidden');
    loadingIndicator.classList.remove('hidden');
    pageGrid.innerHTML = '';
    
    selectedPages.clear();
    updateDownloadButton();

    try {
        await ensureWorker();
        const arrayBuffer = await file.arrayBuffer();
        // Clone the buffer to ensure it's not modified by pdf.js
        currentPdfBytes = arrayBuffer.slice(0);
        
        loadingText.textContent = 'PDF 파싱 중...';
        
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        totalPages = pdf.numPages;
        
        filenameEl.textContent = originalFileName;
        fileMetaEl.textContent = `(${totalPages} pages, ${fileSizeStr})`;

        loadingText.textContent = '페이지 구성 중...';
        
        // Pre-create cards in order
        for (let i = 1; i <= totalPages; i++) {
            createPlaceholderCard(i);
        }

        loadingText.textContent = '썸네일 생성 중...';
        
        // Render thumbnails asynchronously
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
            const promises = [];
            for (let j = 0; j < batchSize && (i + j) <= totalPages; j++) {
                promises.push(renderThumbnailIntoCard(pdf, i + j));
            }
            await Promise.all(promises);
            // Small pause for UI responsiveness
            await new Promise(r => setTimeout(r, 10));
        }
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('PDF 파일을 불러오는 중 오류가 발생했습니다: ' + error.message);
        resetWorkspace();
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function createPlaceholderCard(pageNum) {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.id = `page-card-${pageNum}`;
    card.dataset.page = pageNum;
    
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = '<div class="spinner small"></div>'; // Loading indicator for specific card
    
    const pageLabel = document.createElement('div');
    pageLabel.className = 'page-number';
    pageLabel.textContent = `Page ${pageNum}`;

    card.appendChild(canvasContainer);
    card.appendChild(pageLabel);

    card.addEventListener('click', () => {
        card.classList.toggle('selected');
        const pNum = parseInt(card.dataset.page);
        if (card.classList.contains('selected')) {
            selectedPages.add(pNum);
        } else {
            selectedPages.delete(pNum);
        }
        updateDownloadButton();
    });

    pageGrid.appendChild(card);
}

async function renderThumbnailIntoCard(pdf, pageNum) {
    try {
        const page = await pdf.getPage(pageNum);
        const card = document.getElementById(`page-card-${pageNum}`);
        if (!card) return;

        const container = card.querySelector('.canvas-container');
        
        const viewport = page.getViewport({ scale: 1 });
        const scale = 300 / viewport.width; // Increase quality slightly
        const scaledViewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({
            canvasContext: context,
            viewport: scaledViewport
        }).promise;

        container.innerHTML = '';
        container.appendChild(canvas);

    } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
    }
}

function updateDownloadButton() {
    selectedCountEl.textContent = selectedPages.size;
    btnDownload.disabled = selectedPages.size === 0;
}

function resetWorkspace() {
    currentPdfBytes = null;
    totalPages = 0;
    selectedPages.clear();
    originalFileName = '';
    pdfUpload.value = '';
    
    uploadZone.classList.remove('hidden');
    workspace.classList.add('hidden');
    pageGrid.innerHTML = '';
}

async function generateAndDownloadPDF() {
    if (selectedPages.size === 0 || !currentPdfBytes) return;

    btnDownload.disabled = true;
    const originalText = btnDownload.innerHTML;
    btnDownload.textContent = '생성 중...';

    try {
        // Ensure PDFLib is available
        if (typeof PDFLib === 'undefined') {
            throw new Error('PDF 처리 라이브러리를 불러오지 못했습니다.');
        }

        // Load original PDF
        const pdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
        
        // Create new document
        const newPdfDoc = await PDFLib.PDFDocument.create();

        // Sort selected pages
        const pagesToExtract = Array.from(selectedPages)
            .sort((a, b) => a - b)
            .map(p => p - 1);

        // Copy pages
        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach(page => newPdfDoc.addPage(page));

        // Save
        const pdfBytes = await newPdfDoc.save();

        // Download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
        a.download = `${nameWithoutExt}_extracted.pdf`;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('PDF 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
        btnDownload.disabled = false;
        btnDownload.innerHTML = originalText;
    }
}
