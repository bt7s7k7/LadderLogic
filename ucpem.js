/// <reference path="./.vscode/config.d.ts" />

const { project, github } = require("ucpem")

project.prefix("src").res("ladderLogic",
    github("bt7s7k7/Vue3GUI").res("vue3gui"),
    github("bt7s7k7/Drawer").res("drawerInputVue3"),
    github("bt7s7k7/CommonTypes").res("comTypes")
)