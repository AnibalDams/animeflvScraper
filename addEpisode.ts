import puppeteer from 'puppeteer';
import axios from 'axios';

export default async function addEpisodes(link:any, id:any,cover:any) {
    const browser = await puppeteer.launch(
      
      );
    const page = await browser.newPage();
    await page.goto(link,{
        waitUntil: "domcontentloaded",
    });

    // Wait for the episodes list to load
    await page.waitForSelector('.ListCaps li');
    const episodes:any = await page.evaluate(() => {
        let epi:any = []
        
        const episodeElements = document.querySelectorAll('#episodeList li a').forEach(e=>{
            console.log(e.getAttributeNames())
            epi.push({link:e.getAttribute("href"),episode:e.textContent})
            
        })
        
       return epi
    });

    for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        axios.post(`http://localhost:8000/anime/${id}/episode/new`, {
            name:"Name not provided",
            episodeNumber:episode.episode.split("Episodio")[1],
            synopsis:"Anime got from an external website and it does not have a synopsis for the episodes",
            thumbnail:cover,
            link:""
        })
        
        
        
    }
    console.log("done")
    await browser.close();
}

//getEpisodes();
