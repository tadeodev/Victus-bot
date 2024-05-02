module.exports = {
    add: async function check_user(bot, msg) {
        const userId = msg.chat.id;
        const username = msg.chat.username;
        const lastname = msg.chat.last_name;
        const Name = msg.chat.first_name;
        const userArray = await fetch('http://localhost:8001/v1/api/users/GetUsersIds');
        var userOnDb = await userArray.json().then(function (data) {
            var userArray = data.map(item => item.telegramID);
            const userOnDb = userArray.indexOf(userId);
            return (userOnDb)
            //console.log(data);
        });
        if (userOnDb == -1) {
            const url_up = "http://localhost:8001/v1/api/users/AddUser";
            async function uploadUser(url_up) {
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
                } catch (e) { console.error(e) }
            }
            uploadUser(url_up);
            var message = `Bienvenido a Victus Bot, <b>${Name}</b>!\n\nEste bot te ayudará y avisará de los animes que sigas en animeflv o directamente puedes añadirlos si así deseas desde el comando /añadir\n\nPara empezar tendré que conocerte mejor para poder asaber que animes sigues.\n\nPara poder hacer esto ingresa este comando /miusuario y justo al lado añadirás tu cuenta de animeflv.\n\nEjemplo: /miusuario victus`;
            bot.sendMessage(userId, message, {parse_mode: 'HTML'});
        }
        else {
            bot.sendMessage(userId, `Bienvenido de vuelta <b>${Name}</b>`, {parse_mode: 'HTML'});
        }
    }
}
