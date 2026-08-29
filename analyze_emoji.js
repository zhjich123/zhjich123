const fs = require('fs');
const path = '/workspace/media-sniffer-v1.0.6.user.js';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Common emoji ranges + some specific symbols
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{2122}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{26FF}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}]/gu;

const results = [];
lines.forEach((line, idx) => {
    const matches = [...line.matchAll(emojiRegex)];
    if (matches.length) {
        results.push({
            line: idx + 1,
            emojis: matches.map(m => m[0]),
            text: line.slice(0, 200)
        });
    }
});

console.log('Total lines with emoji:', results.length);
console.log('Total emoji occurrences:', results.reduce((a, b) => a + b.emojis.length, 0));

// Group by emoji
const counts = {};
results.forEach(r => {
    r.emojis.forEach(e => {
        counts[e] = (counts[e] || 0) + 1;
    });
});

console.log('\nEmoji counts:');
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([e, c]) => {
    console.log(`${e} : ${c}`);
});

console.log('\nFirst 50 occurrences:');
results.slice(0, 50).forEach(r => {
    console.log(`L${r.line}: [${r.emojis.join(',')}] ${r.text}`);
});

// Save full results
fs.writeFileSync('/workspace/emoji_analysis.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /workspace/emoji_analysis.json');
