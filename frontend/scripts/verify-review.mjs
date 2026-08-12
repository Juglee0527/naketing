import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const frontendRoot = process.cwd();
const appBuildDirectory = resolve(frontendRoot, ".next", "server", "app");
const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID?.trim() ?? "";

function fail(message) {
  throw new Error(`[review] ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function runNpmScript(script) {
  console.log(`\n[review] npm run ${script}`);
  const npmCli = process.env.npm_execpath;
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, "run", script], { cwd: frontendRoot, stdio: "inherit" })
    : spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script], {
        cwd: frontendRoot,
        shell: process.platform === "win32",
        stdio: "inherit",
      });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readBuildFile(relativePath) {
  const filePath = resolve(appBuildDirectory, relativePath);
  assert(existsSync(filePath), `build 결과에 ${relativePath} 파일이 없습니다.`);
  return readFileSync(filePath, "utf8");
}

function findHtmlFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const filePath = resolve(directory, name);
    if (statSync(filePath).isDirectory()) {
      return findHtmlFiles(filePath);
    }
    return name.endsWith(".html") ? [filePath] : [];
  });
}

function verifyBuildArtifacts() {
  console.log("\n[review] production build 결과 검사");
  assert(existsSync(appBuildDirectory), ".next production build 결과가 없습니다.");

  const expectedPages = [
    "index.html",
    "program.html",
    "methodology.html",
    "guides.html",
    "tools.html",
    "privacy.html",
    "contact.html",
    "guides/30-second-self-introduction.html",
    "tools/speech-time-calculator.html",
    "tools/introduction-length-checker.html",
  ];
  for (const page of expectedPages) {
    readBuildFile(page);
  }

  const sitemap = readBuildFile("sitemap.xml.body");
  const expectedSitemapPaths = [
    "/program",
    "/methodology",
    "/guides",
    "/tools",
    "/privacy",
    "/contact",
    "/guides/30-second-self-introduction",
    "/tools/speech-time-calculator",
    "/tools/introduction-length-checker",
  ];
  for (const path of expectedSitemapPaths) {
    assert(sitemap.includes(`https://www.naketing.co.kr${path}<`), `sitemap에 ${path}가 없습니다.`);
  }
  for (const removedPath of ["/start", "/about", "/founder"]) {
    assert(!sitemap.includes(`https://www.naketing.co.kr${removedPath}<`), `sitemap에 제거 route ${removedPath}가 남아 있습니다.`);
    assert(!existsSync(resolve(appBuildDirectory, `${removedPath.slice(1)}.html`)), `제거 route ${removedPath}가 build됐습니다.`);
  }

  const guideUrlCount = (sitemap.match(/<loc>https:\/\/www\.naketing\.co\.kr\/guides\//g) ?? []).length;
  const toolUrlCount = (sitemap.match(/<loc>https:\/\/www\.naketing\.co\.kr\/tools\//g) ?? []).length;
  assert(guideUrlCount >= 10, `sitemap의 Guide가 ${guideUrlCount}개로 내부 기준 10개보다 적습니다.`);
  assert(toolUrlCount >= 2, `sitemap의 Tool이 ${toolUrlCount}개로 내부 기준 2개보다 적습니다.`);

  const robots = readBuildFile("robots.txt.body");
  assert(robots.includes("Sitemap: https://www.naketing.co.kr/sitemap.xml"), "robots가 운영 sitemap을 안내하지 않습니다.");

  const guideHtml = readBuildFile("guides/30-second-self-introduction.html");
  for (const requiredFragment of [
    '<link rel="canonical" href="https://www.naketing.co.kr/guides/30-second-self-introduction"',
    '<meta property="og:image" content="https://www.naketing.co.kr/opengraph-image"',
    '<meta name="twitter:card" content="summary_large_image"',
    '"@type":"WebSite"',
    '"@type":"Organization"',
    '"@type":"Article"',
    '"@type":"BreadcrumbList"',
  ]) {
    assert(guideHtml.includes(requiredFragment), `대표 Guide HTML에 ${requiredFragment} 계약이 없습니다.`);
  }

  for (const imageName of ["opengraph-image", "twitter-image"]) {
    const metadata = readBuildFile(`${imageName}.meta`);
    const imagePath = resolve(appBuildDirectory, `${imageName}.body`);
    assert(metadata.includes('"content-type":"image/png"'), `${imageName}가 PNG로 생성되지 않았습니다.`);
    assert(existsSync(imagePath) && statSync(imagePath).size > 10_000, `${imageName} 이미지가 비어 있거나 너무 작습니다.`);
  }

  const publicHtmlFiles = findHtmlFiles(appBuildDirectory).filter(
    (filePath) => !filePath.endsWith("_global-error.html"),
  );
  const adScriptPattern = /<script[^>]+pagead2\.googlesyndication\.com[^>]*><\/script>/g;
  for (const filePath of publicHtmlFiles) {
    const html = readFileSync(filePath, "utf8");
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";

    if (publisherId) {
      assert((head.match(adScriptPattern) ?? []).length === 1, `${filePath}의 head에 AdSense 사이트 스크립트가 정확히 한 번 있지 않습니다.`);
      assert((body.match(adScriptPattern) ?? []).length === 0, `${filePath}의 body에 AdSense 사이트 스크립트가 있습니다.`);
    } else {
      assert(!html.includes("pagead2.googlesyndication.com"), `${filePath}에 publisher ID 없이 AdSense 참조가 있습니다.`);
    }
  }

  console.log(`[review] 공개 HTML ${publicHtmlFiles.length}개, Guide ${guideUrlCount}개, Tool ${toolUrlCount}개 확인`);
}

runNpmScript("test");
runNpmScript("lint");
runNpmScript("build");
verifyBuildArtifacts();
console.log("\n[review] 심사 전 저장소 검증을 모두 통과했습니다.");
