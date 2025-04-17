console.log("Let's write some JavaScript");
let currentsong = new Audio();
let songs;
let currfolder;
function secondstominutesseconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    const formattedminutes = String(minutes).padStart(2, '0');
    const formattedseconds = String(remainingseconds).padStart(2, '0');
    return `${formattedminutes}:${formattedseconds}`;
}





async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    return songs;
}
const playMusic = (track, pause = false) => {

    currentsong.src = `/${currfolder}/` + track
    if (!pause) {

        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {

    // Get the list of all the songs
    songs = await getsongs("songs/ncs");
    playMusic(songs[0], true)

    // Add songs to the list
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `<li> <img class="invert" width="34" src="music.svg" alt="">
                           <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Dhruv</div>
                           </div>
                           <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" src="play.svg" alt="">
                           </div>
        
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        });

    })
    //Attach eventlistner to play next aand pusic song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //Listen for time update event
    currentsong.addEventListener("timeupdate", () => {

        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML =
            `${secondstominutesseconds(currentsong.currentTime)} / ${secondstominutesseconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    });
    //  Add an Event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // Calculate the percentage of the click position within the seekbar
        const percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        // Update the position of the circle
        document.querySelector(".circle").style.left = percentage + "%";

        // Set the current time of the song based on the click position
        currentsong.currentTime = (currentsong.duration * percentage) / 100;
    });
    //ADD an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    //ADD an event listner for for close hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-115%"
    })
    //Add an event listner to previous 
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >=0 )
            playMusic(songs[index - 1])
    })
    //Add an event listner to Next
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length )
            playMusic(songs[index + 1])
    })
    //ADD an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e, e.target.value)
        currentsong.volume=parseInt(e.target.value)/100
    })
    //Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("class")).forEach(e=>{console.log(e) 
        e.addEventListener("click",async item=>{
            console.log(item, item.currentTarget.dataset)
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
    
    })

}
// Run main
main();
