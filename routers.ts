import path from "path";
import fs from "fs";

export function getRouters() {
  const files = fs.readdirSync(`${path.resolve(__dirname)}/routes/`);
  const routers = [];

  for (const file of files) {
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const router = require(`./routes/${file}`);
      routers.push(router.default);
    }
  }

  return routers;
}
