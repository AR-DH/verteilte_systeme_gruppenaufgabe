"use strict";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import fs from "fs";
import path from "path";
import shell from "shelljs";

const src_dir = path.normalize(path.join(__dirname, "..", process.env.npm_package_config_static_dir));
const build_dir = path.normalize(path.join(__dirname, "..", process.env.npm_package_config_build_dir));

const replace_extensions = process.env.npm_package_config_replace_variables_extensions.split(";").map(v => v.trim());
const replace_values = {};

Object.keys(process.env).forEach(env_var => {
    if (!env_var.startsWith("npm_package_config_")) return;
    replace_values[env_var.slice(19)] = process.env[env_var];
});

shell.mkdir("-p", build_dir);

shell.ls("-R", src_dir).forEach(file => {
    if (file.startsWith("_") || file.includes("/_")) return;

    let src_path = path.join(src_dir, file);
    let dst_path = path.join(build_dir, file);
    let src_stat = fs.statSync(src_path);

    console.log(file, "=>", dst_path);

    if (src_stat.isDirectory()) {
        // Create sub-directory
        shell.mkdir("-p", dst_path);
    } else {
        // Copy static file and replace variables in text files
        shell.cp(src_path, dst_path);

        if (replace_extensions.some(extension => file.endsWith(extension))) {
            Object.keys(replace_values).forEach(key => {
                shell.sed("-i", `%${key}%`, replace_values[key], dst_path);
            });
        }
    }
});
