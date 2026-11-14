import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, parse } from "node:path";
import test from "node:test";

const root = process.cwd();
const rootRequire = createRequire(import.meta.url);

function dependencyVersionFrom(consumerEntry, dependencyName) {
  const consumerRequire = createRequire(consumerEntry);
  let directory = dirname(consumerRequire.resolve(dependencyName));

  while (directory !== parse(directory).root) {
    const manifestPath = join(directory, "package.json");
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      if (manifest.name === dependencyName) return manifest.version;
    }

    directory = dirname(directory);
  }

  throw new Error(`Could not locate ${dependencyName} package metadata`);
}

test("ESLint consumers resolve the patched minimatch release", () => {
  const eslintEntry = rootRequire.resolve("eslint");
  const eslintRequire = createRequire(eslintEntry);
  const typescriptEslintRequire = createRequire(rootRequire.resolve("typescript-eslint"));
  const consumers = [
    ["eslint", eslintEntry],
    ["@eslint/config-array", eslintRequire.resolve("@eslint/config-array")],
    [
      "@typescript-eslint/typescript-estree",
      typescriptEslintRequire.resolve("@typescript-eslint/typescript-estree"),
    ],
  ];

  for (const [consumer, consumerEntry] of consumers) {
    assert.equal(
      dependencyVersionFrom(consumerEntry, "minimatch"),
      "11.0.3",
      `${consumer} must resolve the reviewed patched release`,
    );
  }
});

test("ESLint keeps file selection, TypeScript config matching, and ignores", async () => {
  const { ESLint } = await import("eslint");
  const eslint = new ESLint({ cwd: root });
  const file = "src/components/islands/OsDetect.tsx";

  const config = await eslint.calculateConfigForFile(file);
  assert.ok(config?.languageOptions?.parser?.parseForESLint);
  assert.equal(await eslint.isPathIgnored("dist/dependency-security-test.js"), true);

  const results = await eslint.lintFiles([file]);
  assert.deepEqual(
    results.map(({ filePath }) => filePath.replaceAll("\\", "/").split("/").slice(-1)[0]),
    ["OsDetect.tsx"],
  );
});

test("TypeScript parser project-service allowlist matches an out-of-project file", async () => {
  const tseslint = await import("typescript-eslint");
  const result = tseslint.default.parser.parseForESLint(
    "const dependencySecurityFixture: string = 'ok';",
    {
      filePath: join(root, "eslint.config.js"),
      projectService: { allowDefaultProject: ["eslint.config.js"] },
      tsconfigRootDir: root,
    },
  );

  assert.ok(result.services.program);
});

const MIN_PATCHED_ASTRO = "7.4.7";

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(version.trim());
  if (!match) return null;

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  };
}

function compareSemver(left, right) {
  const a = parseSemver(left);
  const b = parseSemver(right);
  assert.ok(a, `Invalid semver string: ${left}`);
  assert.ok(b, `Invalid semver string: ${right}`);

  for (const key of ["major", "minor", "patch"]) {
    if (a[key] !== b[key]) return a[key] - b[key];
  }

  if (a.prerelease === b.prerelease) return 0;
  if (a.prerelease === null) return 1;
  if (b.prerelease === null) return -1;
  return a.prerelease.localeCompare(b.prerelease);
}

function minimumVersionFromSpecifier(specifier) {
  assert.equal(typeof specifier, "string", "dependencies.astro specifier must be a string");
  const match = /^\s*(?:\^|~|>=|=)?\s*(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\s*$/.exec(specifier);
  assert.ok(
    match,
    `dependencies.astro (${specifier}) must declare a concrete minimum semver version`,
  );
  return match[1];
}

// GHSA-mh32-jxcr-mh9f (fixed in 7.4.5) and GHSA-r3h5-4585-7x3w (fixed in 7.4.7).
test("Astro resolves and declares >= 7.4.7 to patch known advisories", async (t) => {
  await t.test("package.json dependencies.astro requires >= 7.4.7", () => {
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const declaredSpecifier = manifest.dependencies?.astro;
    const declaredMinimum = minimumVersionFromSpecifier(declaredSpecifier);

    assert.ok(
      compareSemver(declaredMinimum, MIN_PATCHED_ASTRO) >= 0,
      `package.json dependencies.astro (${declaredSpecifier}) must require >= ${MIN_PATCHED_ASTRO}`,
    );
  });

  await t.test("resolved astro package version is >= 7.4.7", () => {
    const resolvedVersion = dependencyVersionFrom(import.meta.url, "astro");

    assert.ok(
      compareSemver(resolvedVersion, MIN_PATCHED_ASTRO) >= 0,
      `Resolved astro version (${resolvedVersion}) must be >= ${MIN_PATCHED_ASTRO}`,
    );
  });
});
