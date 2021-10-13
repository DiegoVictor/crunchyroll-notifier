const axios = require("axios");
const fs = require("fs");

axios
  .get("http://feeds.feedburner.com/crunchyroll/rss/anime?lang=ptBR")
  .then(({ data: rss }) => fs.promises.writeFile(`${__dirname}/feed.xml`, rss));
