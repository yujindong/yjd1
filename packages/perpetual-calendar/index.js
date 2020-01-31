"use strict";

if (process.env.NODE_ENV === "production") {
    module.exports = require("./cjs/perpetual-calendar.min.js");
} else {
    module.exports = require("./cjs/perpetual-calendar.js");
}
