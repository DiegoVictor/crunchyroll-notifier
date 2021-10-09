import axios from "axios";
import * as fs from "fs";

axios
  .get("http://feeds.feedburner.com/crunchyroll/rss/anime?lang=ptBR")
  .then(({ data: rss }) => fs.promises.writeFile("feed.xml", rss));
