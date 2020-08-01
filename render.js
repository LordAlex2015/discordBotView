module.exports = {
    /**
     * @param {Eris.Client} client - Base Client
     * @returns {Promise<HTMLElement>}
     */
    render: async (client) => {
        return new Promise(async (resolve) => {
            let d = "";
            await client.guilds.forEach(g => {
                d += `<div class="guild"><a href="guild/${g.id}"><img src="${g.iconURL}" alt="${g.name}">${g.name}</a> <p>
    Owner: ${g.ownerID} <br>
    Created At: ${g.createdAt} 
</p></div> <br>`
            })
            resolve(d);
            delete d;
        })
    },
    /**
     * @param {Eris.Client} client - Base Client
     * @returns {Promise<HTMLElement>}
     */
    mpRender: async (client) => {
        return new Promise(async (resolve) => {
            let d = "";
            await client.privateChannels.forEach((chan) => {
                if (chan.lastMessageID !== null) {
                    d += `<div class="user" data-toggle="popover" title="${chan.recipient.username}#${chan.recipient.discriminator}" data-content="${chan.recipient.id}"><a href="/channel/${chan.id}"><img src="${chan.recipient.avatarURL}" alt="${chan.recipient.username}"><h3>${chan.recipient.username}#${chan.recipient.discriminator} ${chan.recipient.bot ? '<span class="badge badge-primary">BOT</span>' : ''}${chan.recipient.system ? '<span class="badge badge-primary">System</span>' : ''}</h3> ID: ${chan.recipient.id}</a></div>`;

                }
            })
            await client.users.forEach((user) => {
                client.getDMChannel(user.id).then(chan => {
                    if (chan.lastMessageID && chan.lastMessageID !== '') {
                        //d += `<span class="user">B<a href="/channel/${chan.id}"><img src="${chan.recipient.avatarURL}" alt="${chan.recipient.username}"></a></span>`;
                    }
                }).catch(err => {

                })
            })
            resolve(d);
        })
    },
    /**
     * @param {Eris.Client} client - Base Client
     * @returns {Promise<HTMLElement>}
     */
    mpUniqueRender: async (client) => {
        return new Promise(async (resolve) => {
            let d = "This will be take to 1 hour to load all DM (Refresh the page to load more)<br><br>";
            await client.privateChannels.forEach((chan) => {
                if (chan.lastMessageID !== null) {
                    d += `<span class="user" data-toggle="popover" title="${chan.recipient.username}#${chan.recipient.discriminator}" data-content="${chan.recipient.id}"><a href="/channel/${chan.id}"><img src="${chan.recipient.avatarURL}" alt="${chan.recipient.username}"></a></span>`;

                }
            })
            await client.users.forEach((user) => {
                client.getDMChannel(user.id).then(chan => {
                    if (chan.lastMessageID && chan.lastMessageID !== '') {
                        //d += `<span class="user">B<a href="/channel/${chan.id}"><img src="${chan.recipient.avatarURL}" alt="${chan.recipient.username}"></a></span>`;
                    }
                }).catch(err => {

                })
            })
            resolve(d);
        })
    },
    /**
     * @param {Eris.Client} client - Base Client
     * @param {string} guildId - The id of the guild to Render
     * @returns {Promise<HTMLElement>}
     */
    guildRender: async (client, guildId) => {
        return new Promise(async (resolve) => {
            let d = "<div class=\"accordion\" id=\"accordionExample\">";
            await client.guilds.find(g => g.id === guildId).channels.forEach(g => {
                if (g.type === 0 || g.type === 5 || g.type === 6) {
                    d += `<div class="channel"><span style="margin-left:25px" data-toggle="collapse" href="#${g.id}" role="button" aria-expanded="false" aria-controls="${g.id}"># ${g.name}</span></div><div class="collapse" id="${g.id}">
  <div class="card card-body">
    <iframe src="/channel/${g.id}" frameborder="0" height="500" width="1000"></iframe>
  </div>
</div><br>`
                } else if (g.type === 4) {
                    d += `<div class="channel">V ${g.name}</div><br>`
                } else if (g.type === 2) {
                    d += `<div class="channel"><span style="margin-left:25px">🔊 >${g.name}</span></div><br>`
                }
            })
            d += "</div>"
            resolve(d);
            delete d;
        })
    },
    /**
     * @param {Eris.Client} client - Base Client
     * @param {string} channelId - The id of the channel to Render
     * @returns {Promise<HTMLElement>}
     */
    channelRender: async (client, channelId) => {
        return new Promise(async (resolve) => {
            let d = "";
            client.getMessages(channelId, 1000).then(msgs => {
                for (const msg of msgs.reverse()) {
                    let x = 'EMBED:';
                    for (const embed of msg.embeds) {
                        let f = "";
                        if (embed.fields) {
                            for (let i = 0; i < 25; i++) {
                                if (embed.fields[i]) {
                                    f += `<h5>${embed.fields[i].name}</h5>${embed.fields[i].value}`
                                }
                            }
                        }
                        x += `<h4>${embed.title ? embed.title : ''}</h4> <br> ${embed.description ? embed.description : ''} ${f}`
                    }
                    d += `<h3><a href="/user/${msg.author.id}"><img src="${msg.author.avatarURL}" alt="${msg.author.username}" height="25">${msg.author.username}${msg.author.bot ? ' <span class="badge badge-primary">BOT</span>' : ''}${msg.author.system ? ' <span class="badge badge-primary">System</span>' : ''}</a></h3> <br> ${msg.content.replace(/\n/g,'<br>')} <br>  ${x}`;

                }
                resolve(d);
            }).catch(err => {
                console.log(err)
            })
            delete d;
        })
    },
    /**
     * @param {Eris.Client} client - Base Client
     * @param {string} userId - The id of the user to Render
     * @returns {Promise<HTMLElement>}
     */
    userRender: async (client, userId) => {
        return new Promise(async (resolve) => {
            const user = client.users.find(u => u.id === userId)
            resolve(`<div class="user"><img src="${user.avatarURL}" alt="${user.username}"> <span class="username">${user.username}#${user.discriminator}</span>ID: ${user.id} <br> IsBot: ${user.bot} <br> IsSystem: ${user.system}</div>`)

        })
    }
}