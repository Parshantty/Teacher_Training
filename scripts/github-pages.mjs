import { spawnSync } from 'node:child_process';
const credential = spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', windowsHide: true, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' } });
if (credential.status !== 0) { console.error('GitHub credentials unavailable. Authenticate Git Credential Manager to publish.'); process.exit(1); }
const values = Object.fromEntries(credential.stdout.trim().split('\n').map((line) => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1).trim()]; }));
if (!values.password) { console.error('No GitHub access token returned.'); process.exit(1); }
const root = 'https://api.github.com/repos/Parshantty/Teacher_Training';
const headers = { Authorization: `Bearer ${values.password}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
async function request(path, method = 'GET', body) {
  const response = await fetch(root + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = response.status === 204 ? {} : await response.json();
  return { status: response.status, data };
}
const mode = process.argv[2] || 'status';
if (mode === 'enable') {
  const current = await request('/pages');
  const result = current.status === 404 ? await request('/pages', 'POST', { build_type: 'workflow' }) : current.data.build_type === 'workflow' ? current : await request('/pages', 'PUT', { build_type: 'workflow' });
  console.log(JSON.stringify({ action: 'enable-pages', status: result.status, url: result.data.html_url, message: result.data.message }));
} else {
  const repo = await request('');
  const pages = await request('/pages');
  const runs = await request('/actions/runs?per_page=3');
  console.log(JSON.stringify({ repository: { status: repo.status, name: repo.data.full_name, private: repo.data.private, default_branch: repo.data.default_branch }, pages: { status: pages.status, url: pages.data.html_url, build_type: pages.data.build_type, message: pages.data.message }, runs: { status: runs.status, items: runs.data.workflow_runs?.map((r) => ({ id: r.id, status: r.status, conclusion: r.conclusion, url: r.html_url })) } }, null, 2));
}
