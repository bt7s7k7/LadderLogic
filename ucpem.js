/// <reference path="./.vscode/config.d.ts" />

const { project, github } = require("ucpem")

project.prefix("src").res("ladderLogic",
    github("bt7s7k7/Vue3GUI").res("vue3gui")
)