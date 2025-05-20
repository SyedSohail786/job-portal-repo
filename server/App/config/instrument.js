// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://784590dd4115298a77ff8e80b0c563e1@o4509332440678400.ingest.us.sentry.io/4509332445986816",
  integrations: [
     Sentry.mongooseIntegration(),
     nodeProfilingIntegration(),
],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});