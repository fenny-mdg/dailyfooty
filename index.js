import "dotenv/config";
import closeWithGrace from "close-with-grace";
import chalk from "chalk";

closeWithGrace(async ({ err }) => {
  if (err) {
    console.error(chalk.red(err));
    console.error(chalk.red(err.stack));
    process.exit(1);
  }
});

// if (process.env.MOCKS === 'true') {
// 	await import('./tests/mocks/index.ts')
// }

if (process.env.NODE_ENV === "production") {
  try {
    const res = await import("./server-build/index.js");
  } catch (error) {
    console.log(error);
  }
} else {
  await import("./server/index.ts");
}
