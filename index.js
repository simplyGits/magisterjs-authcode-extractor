const WORK_DIR = `/authcode-fetcher-${Date.now()}`;

const puppeteer = require('puppeteer');
const shell = require('shelljs');
const semver = require('semver');

shell.config.verbose = true;

const oldAuthCode = require('@magisterjs/authcode');
console.log('current authcode', oldAuthCode);

if (!shell.which('git') || !shell.which('npm')) {
	console.error('needs git and npm');
	process.exit(1);
}

function updatePackage(newAuthCode) {
	// goto tmpdir
	shell.mkdir(WORK_DIR);
	shell.cd(WORK_DIR);

	// pull package
	shell.exec('git clone git@github.com:simplyGits/magisterjs-authcode.git ./package');
	shell.cd('./package');

	// update code.json
	shell.ShellString(JSON.stringify(newAuthCode)).to('code.json');

	// update package.json
	const manifest = JSON.parse(shell.cat('package.json'));
	manifest.version = semver.inc(manifest.version, 'minor');
	shell.ShellString(JSON.stringify(manifest, null, 2)+'\n').to('package.json');

	// git push
	shell.exec('git add .');
	shell.exec('git commit -m update');
	shell.exec('git push');

	// npm pub
	shell.exec('npm pub --access public');
}

let browser;
async function main() {
	browser = await puppeteer.launch({
		executablePath: 'google-chrome-unstable',
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
	});
	const page = await browser.newPage();
	await page.goto('https://adelbert.magister.net/');

	const request = await page.waitForRequest('https://accounts.magister.net/challenge/current');
	const data = JSON.parse(request.postData());

	const newAuthCode = data.authCode;
	console.log('retrieved authcode', newAuthCode);

	if (newAuthCode !== oldAuthCode) {
		updatePackage(newAuthCode);
	}
}

main()
	.catch(console.error)
	.finally(() => browser.close())
	.catch(console.error);
