const fs = require("fs");
const path = require("path");

// Create dist directory
const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");

// Clean dist directory if it exists
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
  console.log("✓ Cleaned dist directory");
}

// Create dist directory
fs.mkdirSync(distDir);
console.log("✓ Created dist directory");

// Copy public files to dist
function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied ${entry.name}`);
    }
  }
}

// Copy all files from public to dist
console.log("\nCopying files to dist:");
copyDirectory(publicDir, distDir);

// Copy server.js to dist
fs.copyFileSync(
  path.join(__dirname, "server.js"),
  path.join(distDir, "server.js")
);
console.log("  ✓ Copied server.js");

// Copy package.json to dist (for deployment)
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
);

// Create a production package.json (only with necessary fields)
const prodPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: packageJson.main,
  scripts: {
    start: packageJson.scripts.start,
  },
  dependencies: packageJson.dependencies,
  license: packageJson.license,
};

fs.writeFileSync(
  path.join(distDir, "package.json"),
  JSON.stringify(prodPackageJson, null, 2)
);
console.log("  ✓ Created package.json");

// Update server.js in dist to serve from current directory
let serverContent = fs.readFileSync(path.join(distDir, "server.js"), "utf8");
serverContent = serverContent.replace(
  "app.use(express.static(path.join(__dirname, 'public')));",
  "app.use(express.static(__dirname));"
);
fs.writeFileSync(path.join(distDir, "server.js"), serverContent);
console.log("  ✓ Updated server.js for production");

console.log("\n✅ Build complete! Production files are in ./dist");
console.log("\nTo run production build:");
console.log("  cd dist");
console.log("  npm install --production");
console.log("  npm start");
