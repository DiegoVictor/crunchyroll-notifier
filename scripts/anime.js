const axios = require("axios");
const fs = require("fs");

const slugify = (string) =>
  string.replace(/\s/gi, "-").replace(/[.#']/gi, "").toLowerCase();

const slug = slugify(process.argv[2]);

axios
  .get(`https://www.crunchyroll.com/${slug}.rss`)
  .then(({ data: rss }) =>
    fs.promises.writeFile(`${__dirname}/${slug}.xml`, rss)
  );
