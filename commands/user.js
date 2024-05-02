module.exports = {
    add: check_user,
    seguir: follow,
    siguiendo: following,
    quitar: unfollow,
    alert: alert,
    info: info
}


async function check_user(bot, msg) {
    //Setters
    const userId = JSON.stringify(msg.chat.id);
    const username = msg.chat.username;
    const lastname = msg.chat.last_name;
    const Name = msg.chat.first_name;
    const userArray = await fetch('http://localhost:8001/v1/api/users.php?opt=GetUsersIds');

    //Get array of users
    const userOnDb = await userArray.json().then(function (data) {
        const userArray = data.map(item => item.telegramID);
        const userOnDb = userArray.includes(userId);
        return (userOnDb)
    });

    //Check if user exists already
    if (!userOnDb) {
        const url_up = "http://localhost:8001/v1/api/users.php?opt=AddUser";
        async function uploadUser(url_up, userId, username, lastname, Name) {
            try {
                const response = await fetch(url_up, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        telegramID: userId,
                        nameUser: Name,
                        LastNameUsr: lastname,
                        UsrName: username
                    })
                })
                console.log(response)
            } catch (e) { console.error(e) }
        }
        uploadUser(url_up, userId, username, lastname, Name);
        var message = `Bienvenido a Victus Bot, <b>${Name}</b>!\n\nEste bot te ayudará y avisará de los animes que sigas en animeflv o directamente puedes añadirlos si así deseas desde el comando /añadir\n\nPara empezar tendré que conocerte mejor para poder asaber que animes sigues.\n\nPara poder hacer esto ingresa este comando /miusuario y justo al lado añadirás tu cuenta de animeflv.\n\nEjemplo: /miusuario victus`;
        bot.sendMessage(userId, message, { parse_mode: 'HTML' });
    }
    else {
        bot.sendMessage(userId, `Bienvenido de vuelta <b>${Name}</b>`, { parse_mode: 'HTML' });
    }
}


async function following(bot, msg) {
    const chatId = msg.chat.id;
    // const telegramID = 1;
    const url = `http://localhost:8001/v1/api/users.php?opt=GetAnimesUsr&usr=${chatId}`;
    console.log(url);
    try {
        const response = await fetch(url);
        const data = await response.json(); // Parse JSON response
        console.log(data); // Log the retrieved data for debugging
        // Extract relevant data from 'data' object and send as message
        const animeNames = data.map(anime => anime.name).join('\n · ');
        if (animeNames != "") {
            bot.sendMessage(chatId, `Los animes que sigues son: \n · ${animeNames}`);
        } else {
            bot.sendMessage(chatId, `No estas siguiendo ningún anime`);
        }
    } catch (e) {
        console.error(e);
    }
}

async function follow(bot, msg, anime) {
    // const anime = "Blue Lock";
    const chatId = msg.chat.id;
    const url = "http://localhost:8001/v1/api/users.php?opt=AddAniUsr"
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameAnime: anime,
                telegramID: chatId
            })

        })
        bot.sendMessage(chatId, `Ha sido añadido correctamente`);
    } catch (e) { console.error(e) }

}

async function unfollow(bot, msg, anime) {
    // const anime = "Blue Lock";
    const chatId = msg.chat.id;
    const url = "http://localhost:8001/v1/api/users.php?opt=DelAniUsr"
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameAnime: anime,
                telegramID: chatId
            })

        })
        bot.sendMessage(chatId, `Ha sido eliminado correctamente`);
    } catch (e) { console.error(e) }

}


async function alert(bot) {
    const usersResponse = await fetch('http://localhost:8001/v1/api/users.php?opt=GetUsersIds');
    const users = await usersResponse.json();
    const userArray = users.map(user => user.telegramID);

    // For each user, check their followed anime
    for (const user of userArray) {
        // Get the IDs of the animes the user follows
        const animeResponse = await fetch(`http://localhost:8001/v1/api/users.php?opt=GetAnimesUsr&usr=${user}`);
        const animeData = await animeResponse.json();

        for (const anime of animeData) {
            const ani_id = anime.ani_id;
            // Fetch the last episode of the anime
            const animeLastCapDl = await fetch(`http://localhost:8001/v1/api/animes.php?opt=GetAnimeById`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ani_id: ani_id
                })
            });
            const animeLastCap = await animeLastCapDl.json(); // Wait for JSON response

            // Check if animeLastCap is not empty
            if (animeLastCap.length > 0) {
                const animeLastEpisode = animeLastCap[0].Last_Episode;

                // Compare the last watched episode with lastCapNoti
                if (animeLastEpisode !== anime.lastCapNoti) {
                    // Perform some action here if needed
                    bot.sendMessage(user, `Capítulo nuevo de ${anime.name} (Episodio: ${animeLastEpisode})`);
                    const response = await fetch("http://localhost:8001/v1/api/users.php?opt=SetAniNoti", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            lastEpisode: animeLastEpisode,
                            ani_id: ani_id,
                            telegramID: user
                        })

                    })
                }
            } else {
                console.log(`No data available for anime with ID ${ani_id}`);
            }
        }
    }
}


async function info(bot, msg, nameAnime) {
    try {
        const response = await fetch('http://localhost:8001/v1/api/animes.php?opt=GetAnimeByName', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameAnime
            })
        })

        const info = await response.json();
        const anime = info[0];

        
        if (!anime || anime.length <= 0 || anime === null) {
            // Call the find function asynchronously
            const suggestion = await find(nameAnime);
            console.log(suggestion)
            if (suggestion === "No matches") {
                bot.sendMessage(msg.chat.id, "No encuentro ningún anime con un nombre parecido");
            } else {

                suggestion.sort((a, b) => {
                    const targetLetter = nameAnime.charAt(0); // La letra objetivo es la primera letra de nameAnime
                    const firstLetterA = typeof a === 'string' && a.length > 0 && a.toLowerCase().startsWith(targetLetter.toLowerCase());
                    const firstLetterB = typeof b === 'string' && b.length > 0 && b.toLowerCase().startsWith(targetLetter.toLowerCase());
                
                    if (firstLetterA && !firstLetterB) {
                        return -1; // a viene antes que b
                    } else if (!firstLetterA && firstLetterB) {
                        return 1; // b viene antes que a
                    } else {
                        // Si ambas palabras comienzan con la misma letra o ninguna lo hace, se ordenan alfabéticamente
                        return a.localeCompare(b);
                    }
                });

                bot.sendMessage(msg.chat.id,
                    "Quizas quisiste decir:" + "\n" +
                    "· " + suggestion[0] + "\n" + 
                    "· " + suggestion[1] + "\n" +
                    "· " + suggestion[2] + "\n" +
                    "· " + suggestion[3] + "\n" +
                    "· " + suggestion[4]
                );
            }
        } else {
            bot.sendMessage(msg.chat.id,
                "Nombre : " + anime.name + "\n" +
                "Tipo: " + anime.type + "\n" +
                "Estado: " + anime.Status + "\n" +
                "Último capítulo: " + anime.Last_Episode
            );
        }
        
    } catch (error) {
        console.error(error);
    }
}



async function find(nameAnime){
    try {
        const response = await fetch('http://localhost:8001/v1/api/animes.php?opt=Find', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: nameAnime
            })
        })

        const suggestion = await response.json();
        if (suggestion != null || suggestion.length <=0){
            console.log(suggestion)
          return suggestion.slice(0, 5);
        }
        else{
            return [];
        }
    } catch (e) {
        console.error(e);
    }
}

