const fs = require("fs");
const blog_idl = require("../target/idl/evoting_system.json");

fs.writeFileSync("./app/config/idl.json", JSON.stringify(blog_idl, null, 2));