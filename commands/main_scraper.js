module.exports = {
    mainScrape: function main_scrape(cheerio, cloudscraper){

        //-----------Call the main function-----------//

        main()

            //---------------------------------------------//
            //-----Scraping the info on the main page------//
            //-----where last added animes were upload-----//
            //---------------------------------------------//

        async function main() {
            const options = {

                //-----------Headers to not get blocked by cloudfare-----------//

                uri: 'https://www3.animeflv.net/',
                headers: { //Need to check if there's a way to get the cookie by it's own
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
                    'Cache-Control': 'private',
                    'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
                }, //check automate cookie generation, but don't know how 
                cloudflareMaxTimeout: 30000,
                followAllRedirects: true,
                challengesToSolve: 3,
            };

            cloudscraper(options).then((scraped) => {
                const $ = cheerio.load(scraped);

                //-----------Array of animelisted on by names-----------//

                const animelist = [...$(".Title").contents()]
                    .filter(e => e.type === "text" && $(e).text().trim())
                    .slice(1, 21)
                    .map(e => $(e).text().trim());
                //console.log(animelist)

                //-----------Array of episodes-----------//

                const episode = [...$(".Capi").contents()]
                    .filter(e => e.type === "text" && $(e).text().trim())
                    .map(e => $(e).text().trim());
                //console.log(episode)

                //-----------Filtering and separating data for upload-----------//

                const add_animes = animelist.forEach(element => {
                    const index_anime = animelist.indexOf(element);
                    //console.log(`${element} ${episode[index_anime]}`)

                    //-----------Replacing the word "Episodio " to only take the number-----------//

                    const episodes = episode[index_anime].replace('Episodio ',''); 
                    
                    const name = animelist[index_anime];
                    //console.log(episodes)
                    const url_up = "http://localhost:8001/v1/api/animes.php?opt=AddAnime";

                    //-----------Calling the function to upload the data-----------//

                    uploadAnime(url_up, name, episodes)
                });

                //-----------Function to upload all the data collected-----------//

                async function uploadAnime(url_up, name, episodes) {
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
            }).catch(err => console.error(err))
        }

    }
}
