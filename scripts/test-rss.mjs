import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser();

async function testRSS(url) {
  try {
    const feed = await parser.parseURL(url);
    return {
      success: true,
      title: feed.title || "Untitled",
      itemCount: feed.items?.length || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  const data = fs.readFileSync("sources.json", "utf8");
  const sources = JSON.parse(data);

  console.log(`Testing ${sources.length} RSS sources...\n`);

  let successCount = 0;
  const results = [];

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const enabled = source.enabled !== false;
    const status = enabled ? "[✓]" : "[ ]";
    console.log(`${status} ${i + 1}/${sources.length} Testing: ${source.name}`);

    if (!enabled) {
      results.push({ name: source.name, url: source.url, enabled: false });
      continue;
    }

    const result = await testRSS(source.url);
    if (result.success) {
      console.log(`    ✓ Success: ${result.title} (${result.itemCount} items)`);
      successCount++;
    } else {
      console.log(`    ✗ Failed: ${result.error}`);
    }

    results.push({
      name: source.name,
      url: source.url,
      enabled,
      ...result,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total: ${sources.length}`);
  console.log(`Enabled: ${sources.filter((s) => s.enabled !== false).length}`);
  console.log(`Valid: ${successCount}`);
  console.log(`Invalid: ${
    sources.filter((s) => s.enabled !== false).length - successCount
  }`);

  fs.writeFileSync(
    "rss-test-results.json",
    JSON.stringify(results, null, 2)
  );
  console.log(`\nResults saved to rss-test-results.json`);
}

main().catch(console.error);
