// 

import axios from 'axios';
import * as cheerio from 'cheerio';
import addEpisodes from './addEpisode';


async function scrap2(){

    const url = await axios("https://www3.animeflv.net/browse?page=2")
    const scraper = cheerio.load(url.data)
    const animes = []
    // imgLinks:[{selector:"span.Image>img", value:"src"}]
    const title = scraper("main.Main>ul.ListAnimes").extract({names:[{selector:"h3.Title"}]})
   const cover =scraper("main.Main>ul.ListAnimes").extract({images:[{selector:"div.Image>figure>img", value:"src"}]})
   const links =scraper("main.Main>ul.ListAnimes").extract({links:[{selector:"article.Anime>a", value:"href"}]})
   

    for (let i = 0; i < title.names.length; i++) {
        const titl = title.names[i];
        animes.push({title:titl,japaneseName:"", cover:"",link:"", genres:[], synopsis:"", onGoing:0})
        
    }
    for (let index = 0; index < cover.images.length; index++) {
        const cov = cover.images[index];
        animes[index]["cover"] = `${cov}`
    }

    for (let index = 0; index < links.links.length; index++) {
        const link = links.links[index];
        animes[index]["link"]=`https://www3.animeflv.net${link}`
        
    }
    for (let index = 0; index < animes.length; index++) {
        const anime = animes[index];
        const getInfo = await axios(anime.link)
        const $ = cheerio.load(getInfo.data);
        const genres:any = $("nav.Nvgnrs").extract({genres:[{selector:"a"}]})
        const japaneseName:any = $("div.Ficha").extract({japaneseName:[{selector:"div.Container>div>span"}]})
        const synopsis:any = $("div.Description").extract({synopsis:[{selector:"p"}]})
        const status:any = $("aside.SidebarA").extract({status:[{selector:"span.fa-tv"}]})
        animes[index]["genres"]=genres.genres
        animes[index]["japaneseName"]=japaneseName.japaneseName.length>=3?japaneseName.japaneseName[1]:japaneseName.japaneseName[0]
        animes[index]["synopsis"]=synopsis.synopsis[0]
        animes[index]["onGoing"]=status.status[0]=="En emision"?1:0

    }
    console.log(animes.length)
      for (let i = 0; i < animes.length; i++) {
          const anime = animes[i];
        await axios.post("http://localhost:8000/anime/new", {
             name:anime.title,
              japaneseName:anime.japaneseName,
              synopsis:anime.synopsis,
              releaseYear:"0000",
              studio:"animeFlv",
              cover:anime.cover,
              image:"",
              onGoing:anime.onGoing,
              genres:anime.genres,
              horizontalImage:"",
          }) 

        
      }
      for (let i = 0; i < animes.length; i++) {
        const anime = animes[i];
        const animesOfPage = (await axios("http://localhost:8000/anime/d/studio/animeFlv")).data
        const animeU = animesOfPage.animes.find((e:any)=>e.name === anime.title)
        await addEpisodes(anime.link,animeU.id,animeU.cover)
        
      }



}

async function scrap3() {
    const url = await axios("https://www3.animeflv.net/anime/kekkon-suru-tte-hontou-desu-ka")
    const scraper = cheerio.load(url.data)
    const animes = []
    // imgLinks:[{selector:"span.Image>img", value:"src"}]
    console.log(scraper("#episodeList ").extract({names:[{selector:"li a h3.Title"}]}))
}

console.log(scrap2())