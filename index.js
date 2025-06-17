const { addonBuilder } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const builder = new addonBuilder({
  id: "org.trakt.usercalendar",
  version: "1.0.0",
  name: "My Trakt Calendar",
  description: "Shows your Trakt calendar in Stremio",
  types: ["series"],
  catalogs: [{
    type: "series",
    id: "trakt-user-calendar",
    name: "Trakt Calendar"
  }],
  resources: ["catalog"]
});

builder.defineCatalogHandler(async () => {
  const traktToken = "REPLACE_WITH_YOUR_ACCESS_TOKEN";
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(`https://api.trakt.tv/calendars/my/shows/${today}/7`, {
    headers: {
      "Authorization": `Bearer ${traktToken}`,
      "trakt-api-version": "2",
      "trakt-api-key": "REPLACE_WITH_YOUR_CLIENT_ID"
    }
  });

  const data = await res.json();

  const metas = data.map(entry => {
    const show = entry.show;
    return {
      id: show.ids.imdb || show.ids.tmdb || show.ids.slug,
      type: "series",
      name: show.title,
      poster: show.images?.poster?.full || "",
      description: `Next Episode: S${entry.episode.season}E${entry.episode.number} - ${entry.episode.title}`
    };
  });

  return { metas };
});

module.exports = builder.getInterface();