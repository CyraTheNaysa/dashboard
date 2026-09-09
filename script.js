function updateclock(){
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const day = now.toLocaleDateString("en-US",{
        weekday: "long"
    
    });

    document.getElementById("clock").textContent = time;
    document.getElementById("date").textContent = day;
}
updateclock();

setInterval(updateclock, 1000);

async function getquote(){
    try{
        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );
        const data = await response.json();
        document.getElementById("quote").textContent = `"${data.quote}"`;
        document.getElementById("author").textContent = `- ${data.author}`;
    } catch (error){
        document.getElementById("quote").textContent = "We failed to load the quote today :C keep up the good work!";
    }
}

getquote();

function openShortcut(url){
    window.open(url, "_blank");
}

function addShortcut(){
    alert("Shortcut added")
}
