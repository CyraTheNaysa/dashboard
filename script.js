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

function addtask(){
    const taskname = prompt("Task name :")
    if(taskname == null || taskname.trim()=== ""){
        return;
    }
    const deadline = prompt("Deadline :");
    if(deadline == null || deadline.trim()=== ""){
        return;
    }
    const task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML =`
    <div class="task-content">
        <strong id="task-name">${taskname}</strong>
        <span id="task-deadline">${deadline}</span>
    </div>
    <button class="edit-task">O</button>
    <button class="complete-task">v</button>`;

    document.getElementById("task-list").appendChild(task);
}

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
    button.classList.add("shortcut","custom-shortcut");
    button.textContent = name;
    button.dataset.url = finalurl;

    button.onclick = function(){
        openShortcut(finalurl);
    };
    const addbutton = document.querySelector(".add-shortcut");
    document.querySelector(".shortcuts").insertBefore(
        button, addbutton
    );
    saveshortcuts();
}

function saveshortcuts(){
    const buttons = document.querySelectorAll(".custom-shortcut");
    const shortcuts = [];
    buttons.forEach(button => {
        shortcuts.push({
            name: button.textContent,
            url: button.dataset.url
        });
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    });
}

function loadshortcuts(){
    const savedshortcuts = localStorage.getItem("shortcuts");
    if(!savedshortcuts){
        return;
    }
    const shortcuts = JSON.parse(savedshortcuts);
    const container = document.querySelector(".shortcuts");
    const addbutton = document.querySelector(".add-shortcut");

    shortcuts.forEach(shortcut => {
        const button = document.createElement("button");
        button.classList.add("shortcut", "custom-shortcut");
        button.textContent = shortcut.name;
        button.dataset.url = shortcut.url;

        button.onclick = function(){
            openShortcut(shortcut.url);
        };
        container.insertBefore(button, addbutton);
    });
}
loadshortcuts();

const completebutton = document.querySelector(".complete-task");
completebutton.addEventListener("click",function(){
    const task = document.querySelector(".task");
    task.classList.toggle("completed");
    savetask();
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
    savetask();
});

function updatecurrenttask(){
    const now = new Date();
    const day = now.toLocaleDateString("en-US",{
        weekday: "long"
    });

    const period = gettimeperiod();
    let currenttask = schedule[day][period];
    if(typeof currenttask === "object"){
        const weektype = getweektype();
        currenttask = currenttask[weektype];
    }
    document.getElementById("current-task").textContent = currenttask;
}

function savetask(){
    const task = {
        name: document.getElementById("task-name").textContent,
        deadline: document.getElementById("task-deadline").textContent,
        completed: document.querySelector(".task").classList.contains("completed")
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
    if(task.completed){
        document.querySelector(".task").classList.add("completed");
    }

}
loadtask();

const schedule ={
    Monday: {
        morning : "IELTS Writing",
        afternoon : "Task Of The Day",
        night : "Draft Essay"
    },
    Tuesday: {
        morning : "IELTS Reading",
        afternoon : "Task Of The Day",
        night : "Do Whatever"
    },
    Wednesday: {
        morning : "IELTS Listening",
        afternoon : "Task Of The Day",
        night : {
            A:"MEXT Math Paper",
            B:"MEXT Research"
        }
    },
    Thursday: {
        morning : "IELTS Speaking",
        afternoon : "Task Of The Day",
        night : {
            A:"MEXT Research",
            B:"MEXT English Paper"
        }
    },
    Friday: {
        morning : "IELTS Mock Test",
        afternoon : "Task Of The Day",
        night : {
            A:"MEXT English Paper",
            B:"MEXT Math Paper"
        }
    },
    Saturday: {
        morning : "IELTS Class",
        afternoon : "Task Of The Day",
        night : "Do Whatever"
    },
    Sunday: {
        morning : "Sleep in",
        afternoon : "Task Of The Day",
        night : "Do Whatever"
    }
}

function gettimeperiod(){
    const hour = new Date().getHours();

    if(hour < 12){
        return "morning";
    }
    if(hour < 18){
        return "afternoon";
    }
    return "night";
}

function getweektype(){
    const now = new Date();
    const startofyear = new Date(now.getFullYear(),0,1);
    const dayspassed = Math.floor(
        (now - startofyear) / (1000*60*60*24)
    );
    const weeknumber = Math.ceil(
        (dayspassed + startofyear.getDay() + 1)/7
    );

    return weeknumber % 2 === 0 ? "B" : "A";
}
updatecurrenttask();
setInterval(updatecurrenttask, 60000);