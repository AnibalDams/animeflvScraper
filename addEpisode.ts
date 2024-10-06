import puppeteer from 'puppeteer';
import axios from 'axios';
import scrapeIframeLink from './getlink';

export default async function addEpisodes(link:any, id:any,cover:any) {
    const browser = await puppeteer.launch(
      {headless:false}
      );
    const page = await browser.newPage();
    await page.goto(link);

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
    
    await browser.close();
    for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        const link = episode.link!="#"? await scrapeIframeLink(`https://www3.animeflv.net${episode.link}`):""
        axios.post(`http://localhost:8000/anime/${id}/episode/new`, {
            name:"Name not provided",
            episodeNumber:episode.episode.split("Episodio")[1],
            synopsis:"Anime got from an external website and it does not have a synopsis for the episodes",
            thumbnail:cover,
            link:link
        })
        
        
        
    }
    console.log("done")
}

//getEpisodes();
