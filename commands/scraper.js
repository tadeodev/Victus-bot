const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    indexScraper: index_scraper
}
async function index_scraper() {

    //-----------Call the main function-----------//

    //---------------------------------------------//
    //-----Scraping the info on the main page------//
    //-----where last added animes were upload-----//
    //---------------------------------------------//

    const url = "https://www3.animeflv.net/";

    const response = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.'
        }
    });
    //console.log("vivo")

    const $ = cheerio.load(response.data);

    //-----------Array of animelisted on by names-----------//

    const animelist = [...$(".Title").contents()]
        .filter(e => e.type === "text" && $(e).text().trim())
        .slice(1, 21)
        .map(e => $(e).text().trim());
    console.log(animelist)

    //-----------Array of episodes-----------//

    const episode = [...$(".Capi").contents()]
        .filter(e => e.type === "text" && $(e).text().trim())
        .map(e => $(e).text().trim());
    console.log(episode)

    //-----------Filtering and separating data for upload-----------//

    const add_animes = animelist.forEach(element => {
        const index_anime = animelist.indexOf(element);
        //console.log(`${element} ${episode[index_anime]}`)

        //-----------Replacing the word "Episodio " to only take the number-----------//

        const episodes = episode[index_anime].replace('Episodio ', '');

        const name = animelist[index_anime];
        //console.log(episodes)
        
        //-----------Calling the function to upload the data-----------//
        
        uploadAnime(name, episodes)
    });
    
    //-----------Function to upload all the data collected-----------//
    
    async function uploadAnime(name, episodes) {
        const url_up = "http://localhost:8001/v1/api/animes.php?opt=AddAnime";
        try {
            const response = await fetch(url_up, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Last_Episode: episodes
                })
            })
        } catch (e) { console.error(e) }
    }

}
