console.log("Let's write some JavaScript");

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

async function main() {
    // Get the list of all the songs
    let songs = await getsongs();
    console.log(songs);

    // Add songs to the list
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `<li>${song.replaceAll("%20", " ")}</li>`;
    }

    // Play the first song
    let audio = new Audio(`/Spotify/songs/${songs[0]}`);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });
}

// Run main
main();
