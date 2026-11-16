// Publishes dist/ to the gh-pages branch (GitHub Pages serves that branch).
// Run through `npm run deploy`, which builds the site first.
//
// Plain git in a temporary worktree: the gh-pages npm package passes every file name on one command line,
// which Windows rejects (ENAMETOOLONG) once the site has more than a few hundred image files.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const BRANCH = 'gh-pages';
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('dist/ is missing. Run the build first.');

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'site-deploy-'));
git(['fetch', 'origin', BRANCH]);
git(['worktree', 'add', '--detach', '--force', work, `origin/${BRANCH}`]);
try {
  // Replace the branch's content with the new build.
  for (const entry of fs.readdirSync(work)) {
    if (entry !== '.git') fs.rmSync(path.join(work, entry), { recursive: true, force: true });
  }
  fs.cpSync(dist, work, { recursive: true });
  git(['add', '-A'], work);
  if (git(['status', '--porcelain'], work) === '') {
    console.log('Nothing to deploy: the live site already matches this build.');
  } else {
    const source = git(['rev-parse', '--short', 'HEAD']);
    git(['commit', '-q', '-m', `Deploy site (${source})`], work);
    git(['push', 'origin', `HEAD:${BRANCH}`], work);
    console.log('Published', git(['rev-parse', '--short', 'HEAD'], work), `to ${BRANCH}`);
  }
} finally {
  git(['worktree', 'remove', '--force', work]);
}
