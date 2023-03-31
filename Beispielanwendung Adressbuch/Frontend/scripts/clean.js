"use strict";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import path from "path";
import shell from "shelljs";

const build_dir = path.normalize(path.join(__dirname, "..", process.env.npm_package_config_build_dir));

shell.rm("-rf", path.join(build_dir, "*"));
