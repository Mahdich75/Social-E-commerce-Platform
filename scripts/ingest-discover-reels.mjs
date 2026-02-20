import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SOURCE_DIR = process.argv[2] || 'C:\\Users\\mcher\\Downloads\\reels1';
const projectRoot = process.cwd();
const targetRoot = path.join(projectRoot, 'public', 'videos', 'reels1');
const manifestPath = path.join(projectRoot, 'public', 'data', 'discover-local-reels.json');

const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);

const toPosix = (value) => value.replace(/\\/g, '/');

const stableId = (relativeFilePath) =>
  `ldr-${crypto.createHash('sha1').update(relativeFilePath).digest('hex').slice(0, 12)}`;

const collectVideoFiles = (baseDir) => {
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    entries.forEach((entry) => {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walk(absolute));
        return;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (VIDEO_EXTENSIONS.has(ext)) files.push(absolute);
    });

    return files;
  };

  return walk(baseDir).sort((a, b) => a.localeCompare(b, 'en'));
};

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

const sourceFiles = collectVideoFiles(SOURCE_DIR);
if (sourceFiles.length === 0) {
  console.error(`No supported video files found in: ${SOURCE_DIR}`);
  process.exit(1);
}

const groups = new Map();

sourceFiles.forEach((absFile) => {
  const relativeFromSource = path.relative(SOURCE_DIR, absFile);
  const relativePosix = toPosix(relativeFromSource);
  const parts = relativePosix.split('/');
  const fileName = parts[parts.length - 1];
  const folderName = parts.length > 1 ? parts[0] : null;

  const targetAbsPath = path.join(targetRoot, ...parts);
  fs.mkdirSync(path.dirname(targetAbsPath), { recursive: true });
  fs.copyFileSync(absFile, targetAbsPath);

  const reel = {
    id: stableId(relativePosix),
    fileName,
    folderName,
    relativePath: relativePosix,
    videoUrl: `/videos/reels1/${relativePosix}`,
    thumbnail: `https://picsum.photos/seed/${stableId(relativePosix)}/414/736`,
  };

  // Folder => one horizontal row, root-level file => standalone row.
  const groupKey = folderName ? `folder:${folderName}` : `single:${relativePosix}`;
  const group = groups.get(groupKey) ?? {
    rowId: `row-${stableId(groupKey)}`,
    groupType: folderName ? 'folder' : 'single',
    groupName: folderName ?? fileName,
    reels: [],
  };
  group.reels.push(reel);
  groups.set(groupKey, group);
});

const rows = Array.from(groups.values()).map((row) => ({
  ...row,
  reels: row.reels.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en')),
}));

const output = {
  generatedAt: new Date().toISOString(),
  sourceDir: SOURCE_DIR,
  rows,
};

fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(`Copied ${sourceFiles.length} videos into ${targetRoot}`);
console.log(`Generated manifest: ${manifestPath}`);
