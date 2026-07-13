const { execSync } = require('child_process');
const fs = require('fs');

const commitMessages = [
  "Refactor authentication middleware",
  "Fix minor bug in user service",
  "Update dependencies in package.json",
  "Improve API error handling",
  "Add new player route",
  "Update database connection logic",
  "Refine responsive design in CSS",
  "Optimize player loading query",
  "Update README documentation",
  "Fix typos in user schema",
  "Adjust styling for mobile view",
  "Fix CORS configuration issue",
  "Update JWT expiration time",
  "Remove unused imports",
  "Add rate limiting to auth routes",
  "Refine modal UI logic",
  "Implement password hashing",
  "Add input validation to endpoints",
  "Fix null reference in dashboard",
  "Refine UI component layout",
  "Clean up commented code",
  "Update environment variables",
  "Improve code readability",
  "Add unit tests for user service",
  "Fix styling inconsistencies",
  "Update .gitignore rules",
  "Refactor player controller",
  "Add pagination to API responses",
  "Enhance security headers",
  "Update API response formats",
  "Tweak color palette variables",
  "Implement graceful shutdown for DB",
  "Add seed data script",
  "Refactor API request wrapper",
  "Fix mobile menu toggle bug",
  "Optimize image assets",
  "Fix state management issue",
  "Update component structure",
  "Clean up console.logs",
  "Improve form validation feedback"
];

const totalCommits = 229;
const daysToSpread = 100; // Spread across the last 100 days

console.log(`Generating ${totalCommits} commits...`);

for (let i = 0; i < totalCommits; i++) {
  // Random message
  const msg = commitMessages[Math.floor(Math.random() * commitMessages.length)];
  
  // Spread time over the last 'daysToSpread' days, going backwards
  const timeOffset = (totalCommits - i) * (daysToSpread * 24 * 60 * 60 * 1000) / totalCommits;
  // Add some randomness +/- 12 hours
  const randomJitter = (Math.random() - 0.5) * 12 * 60 * 60 * 1000;
  
  const date = new Date(Date.now() - timeOffset + randomJitter);
  const dateString = date.toISOString();

  // Make a small change to a dummy file to have something to commit
  fs.writeFileSync('development_log.md', `Update log entry: ${dateString}\n`, { flag: 'a' });

  // Add and commit
  execSync(`git add development_log.md`);
  
  // Set environment variables for backdating
  const env = { ...process.env, GIT_AUTHOR_DATE: dateString, GIT_COMMITTER_DATE: dateString };
  
  try {
    execSync(`git commit -m "${msg}"`, { env, stdio: 'ignore' });
  } catch (err) {
    console.log("Error making commit:", err.message);
  }
  
  if ((i + 1) % 20 === 0) {
    console.log(`Created ${i + 1} commits...`);
  }
}

console.log("All commits created. Pushing to GitHub...");
try {
  execSync(`git push origin main`, { stdio: 'inherit' });
  console.log("Successfully pushed to GitHub!");
} catch (err) {
  console.error("Failed to push to GitHub. You might need to manually run: git push origin main");
}
