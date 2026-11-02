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
