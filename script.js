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
    const today = new Date().toISOString().split("T")[0];
    const savedquote = localStorage.getItem("dailyquote");
    const saveddate = localStorage.getItem("quotedate");
    if(savedquote && saveddate === today){
        const data = JSON.parse(savedquote);
        document.getElementById("quote").textContent = `"${data.content}"`;
        document.getElementById("author").textContent = `- ${data.author}`;
        return;
    }
    try{
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        localStorage.setItem("dailyquote", JSON.stringify({
            quote: data.quote, author: data.author
        })
    );
    localStorage.setItem("quotedate", today);
    document.getElementById("quote").textContent = `"${data.quote}"`;
    document.getElementById("author").textContent = `- ${data.author}`;
    } catch(error){
    document.getElementById("quote").textContent = "Failed to load quote :c keep up the good work!";
    }
}
getquote();

function openShortcut(url){
    window.open(url, "_blank");
}

function addShortcut(){
    const name = prompt ("Enter shortcut name :");
    if(name == null || name.trim() === ""){
        return;
    }
    const url = prompt("Enter shortcut URL :");
    if(url == null || url.trim() === ""){
        return;
    }
    let finalurl = url.trim();
    if(!finalurl.startsWith("http://") && !finalurl.startsWith("https://")){
        finalurl = "https://" + finalurl;
    }
    const button = document.createElement("button");
    button.classList.add("shortcut");
    button.textContent = name;

    button.onclick = function(){
        openShortcut(finalurl);
    };
    const addbutton = document.querySelector(".add-shortcut");
    document.querySelector(".shortcuts").insertBefore(
        button, addbutton
    );
}

const completebutton = document.querySelector(".complete-task");
completebutton.addEventListener("click",function(){
    const task = document.querySelector(".task");
    task.classList.toggle("completed");
});
const editbutton = document.querySelector(".edit-task");

editbutton.addEventListener("click",function(){
    const taskname = prompt(
        "Enter new task name: ", document.getElementById("task-name").textContent
    );

    if(taskname == null || taskname.trim() === ""){
        return;
    }
    const deadline = prompt(
        "Deadline : ",
        document.getElementById("task-deadline").textContent.replace("Deadline : ", "")
    );
    if(deadline == null || deadline.trim() === ""){
        return;
    }
    document.getElementById("task-name").textContent = taskname;
    document.getElementById("task-deadline").textContent = "Deadline : " + deadline;
    updatecurrenttask();
    savetask();
});

function updatecurrenttask(){
    const taskname = document.getElementById("task-name").textContent;
    document.getElementById("current-task").textContent = taskname;
}

function savetask(){
    const task = {
        name: document.getElementById("task-name").textContent,
        deadline: document.getElementById("task-deadline").textContent
    };
    localStorage.setItem("task", JSON.stringify(task));
}

function loadtask(){
    const savedtask = localStorage.getItem("task");
    if(!savedtask){
        return;
    }
    const task = JSON.parse(savedtask);
    document.getElementById("task-name").textContent = task.name;
    document.getElementById("task-deadline").textContent = task.deadline;
    updatecurrenttask();
}
loadtask();