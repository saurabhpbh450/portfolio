import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port || 5000, () => {
  console.log(`Server running on port ${env.port || 5000}`);
});