const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dirPath, file.name);

        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // Strip all comments
                const stripped = stripComments(content, { keepProtected: true });
                
                // Only write if something actually changed
                if (content !== stripped) {
                    fs.writeFileSync(fullPath, stripped, 'utf8');
                    console.log(`Stripped comments from: ${fullPath}`);
                }
            } catch (err) {
                console.error(`Error processing ${fullPath}:`, err);
            }
        }
    });
}

const targetDir = path.join(__dirname, '../src');
console.log(`Starting to strip comments from ${targetDir}`);
processDirectory(targetDir);
console.log('Finished removing comments.');
