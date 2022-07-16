const event = require("../events");
const lang = event.getString("github");
const axios = require("axios");

event.addCommand(
  { pattern: ["github"], desc: lang.GITHUB_DESC },
  async (message, client) => {
    const pname = message.forPattern.text;

    if (!pname)
      return await client.sendMessage(
        message.client.jid,
        { text: event.errorMessage(lang.REPLY) },
        { quoted: message }
      );

    await client.sendMessage(
      message.client.jid,
      { text: event.infoMessage(lang.LOADING) },
      { quoted: message }
    );

    await axios
      .get(`https://api.github.com/users/${pname}`)
      .then(async (response) => {
        const {
          login,
          avatar_url,
          html_url,
          twitter_username,
          bio,
          name,
          company,
          public_repos,
          public_gists,
          followers,
          location,
          following,
          created_at,
          blog,
          type,
          email,
          updated_at,
        } = response.data;

        const msg =
          `\n⚜ *${lang.NAME}* ${name}` +
          `\n\n` +
          `⚜ *${lang.USERNAME}* ${login}` +
          `\n\n` +
          `⚜ *${lang.TWITTER}* ${twitter_username}` +
          `\n\n` +
          `⚜ *${lang.COMPANY}* ${company}` +
          `\n\n` +
          `⚜ *${lang.BIO}* ${bio}` +
          `\n\n` +
          `⚜ *${lang.BLOG}* ${blog}` +
          `\n\n` +
          `⚜ *${lang.URL}* ${html_url}` +
          `\n\n` +
          `⚜ *${lang.REPO}* ${public_repos}` +
          `\n\n` +
          `⚜ *${lang.GIST}* ${public_gists}` +
          `\n\n` +
          `⚜ *${lang.FOLLOWING}* ${following}` +
          `\n\n` +
          `⚜ *${lang.FOLLOWERS}* ${followers}` +
          `\n\n` +
          `⚜ *${lang.MAIL}* ${email}` +
          `\n\n` +
          `⚜ *${lang.LOCATION}* ${location}` +
          `\n\n` +
          `⚜ *${lang.JOIN}* ${created_at}` +
          `\n\n` +
          `⚜ *${lang.UPDATE}* ${updated_at}\n`;

        await client.sendMessage(
          message.client.jid,
          { text: msg + "\n" + event.jsonConfig.footer, },
          { quoted: message }
        );
      })
      .catch(
        async (err) =>
          await client.sendMessage(
            message.client.jid,
            { text: event.errorMessage(lang.NOT + '\n\n' + err) },
            { quoted: message }
          )
      );
  }
);

// {
//   login: "AiDarkEzio",
//   id: 87601796,
//   node_id: "MDQ6VXNlcjg3NjAxNzk2",
//   avatar_url: "https://avatars.githubusercontent.com/u/87601796?v=4",
//   gravatar_id: "",
//   url: "https://api.github.com/users/AiDarkEzio",
//   html_url: "https://github.com/AiDarkEzio",
//   followers_url: "https://api.github.com/users/AiDarkEzio/followers",
//   following_url:
//     "https://api.github.com/users/AiDarkEzio/following{/other_user}",
//   gists_url: "https://api.github.com/users/AiDarkEzio/gists{/gist_id}",
//   starred_url: "https://api.github.com/users/AiDarkEzio/starred{/owner}{/repo}",
//   subscriptions_url: "https://api.github.com/users/AiDarkEzio/subscriptions",
//   organizations_url: "https://api.github.com/users/AiDarkEzio/orgs",
//   repos_url: "https://api.github.com/users/AiDarkEzio/repos",
//   events_url: "https://api.github.com/users/AiDarkEzio/events{/privacy}",
//   received_events_url:
//     "https://api.github.com/users/AiDarkEzio/received_events",
//   type: "User",
//   site_admin: false,
//   name: "Subadra Poshitha",
//   company: "Subadra Poshitha",
//   blog: "https://AiDarkEzio.github.io/",
//   location: "Sri Lanka",
//   email: null,
//   hireable: null,
//   bio: null,
//   twitter_username: null,
//   public_repos: 38,
//   public_gists: 0,
//   followers: 3,
//   following: 18,
//   created_at: "2021-07-18T10:09:38Z",
//   updated_at: "2022-07-06T04:13:23Z",
// }
