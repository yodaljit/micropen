import { Editor } from '../editor';

// Initialize editor
const editor = new Editor({
    element: document.getElementById('editor')!,
    onChange: () => {
        updateButtonStates();
    }
});

// Setup toolbar buttons
const buttonIds = {
    // Text formatting
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    color: 'color',
    
    // Links and media
    link: 'link',
    image: 'image',
    
    // Block formatting
    heading: 'heading',
    list: 'list',
    code: 'code',
    blockquote: 'blockquote',
    alignLeft: 'align-left',
    alignCenter: 'align-center',
    alignRight: 'align-right',
    
    // History
    undo: 'undo',
    redo: 'redo'
};

// Get available buttons
const buttons: Record<string, HTMLElement> = {};
Object.entries(buttonIds).forEach(([feature, id]) => {
    const button = document.getElementById(id);
    if (button) {
        buttons[feature] = button;
    }
});

// Update button states based on current selection
const updateButtonStates = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
        // Clear all active states when no selection
        Object.values(buttons).forEach(button => button.classList.remove('active'));
        return;
    }

    // Update each button based on editor's active state
    Object.entries(buttons).forEach(([feature, button]) => {
        button.classList.toggle('active', editor.isActive(feature));
    });
};

// Execute a feature
const executeFeature = async (feature: string) => {
    try {
        // Enable feature if not already enabled
        if (!editor.hasFeature(feature)) {
            await editor.enable(feature);
        }

        // Execute the feature
        editor.execute(feature);
        updateButtonStates();
        
    } catch (error) {
        console.error(`Error with feature ${feature}:`, error);
    }
};

// Handle button clicks
Object.entries(buttons).forEach(([feature, button]) => {
    button.addEventListener('click', () => executeFeature(feature));
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                executeFeature('bold');
                break;
            case 'i':
                e.preventDefault();
                executeFeature('italic');
                break;
            case 'u':
                e.preventDefault();
                executeFeature('underline');
                break;
            case 'k':
                e.preventDefault();
                executeFeature('link');
                break;
            case 'z':
                e.preventDefault();
                executeFeature(e.shiftKey ? 'redo' : 'undo');
                break;
        }
    }
});

// Update button states on selection change
document.addEventListener('selectionchange', updateButtonStates);

// Format initial content
const editor_content = document.getElementById('editor')!;
editor_content.innerHTML = `
    <p>Try editing this text. Select some text and use the toolbar buttons to format it.</p>
    
    <p>Keyboard shortcuts:</p>
    <ul>
        <li><strong>Bold:</strong> Ctrl/Cmd + B</li>
        <li><strong>Italic:</strong> Ctrl/Cmd + I</li>
        <li><strong>Underline:</strong> Ctrl/Cmd + U</li>
        <li><strong>Link:</strong> Ctrl/Cmd + K</li>
        <li><strong>Undo:</strong> Ctrl/Cmd + Z</li>
        <li><strong>Redo:</strong> Ctrl/Cmd + Shift + Z</li>
    </ul>
`;

// Display bundle size
const sizeDisplay = document.getElementById('size-display')!;
const updateSize = () => {
    const codeSize = new TextEncoder().encode(editor.toString()).length;
    sizeDisplay.textContent = `Bundle Size: ${(codeSize / 1024).toFixed(2)}KB`;
};

// Update size every second
setInterval(updateSize, 1000);

// Initial size update
updateSize();
