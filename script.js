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
    task.draggable = true;
    task.innerHTML =`
    <div class="task-content">
        <strong id="task-name">${taskname}</strong>
        <span id="task-deadline">${deadline}</span>
    </div>
    <button class="edit-task">O</button>
    <button class="complete-task">v</button>
    <button class="delete-task">X</button>`;

    document.getElementById("task-list").appendChild(task);
    savetasklist();
}

function savetasklist(){
    const tasks = document.querySelectorAll("#task-list .task");
    const tasklist = [];

    tasks.forEach(task => {
        tasklist.push({
            name: task.querySelector(".task-content strong").textContent,
            deadline: task.querySelector(".task-content span").textContent,
            completed: task.classList.contains("completed")
        });
    });

    localStorage.setItem("tasklist", JSON.stringify(tasklist));
}

function loadtasklist(){
    const savedlist = localStorage.getItem("tasklist");
    if(!savedlist){
        return;
    }
    const tasklist = JSON.parse(savedlist);
    const container = document.getElementById("task-list");

    container.innerHTML = "";

    tasklist.forEach(item => {
        const task = document.createElement("div");
        task.classList.add("task");
        task.draggable = true;

        if(item.completed){
            task.classList.add("completed");
        }

        task.innerHTML = `
            <div class="task-content">
                <strong>${item.name}</strong>
                <span>${item.deadline}</span>
            </div>

            <button class="edit-task">O</button>
            <button class="complete-task">v</button>
            <button class="delete-task">X</button>
        `;

        container.appendChild(task);
    });
}

let draggedtask = null;
document.addEventListener("dragstart", function(e){
    if(e.target.classList.contains("task")){
        draggedtask = e.target;
    }
});

function deletetask(task){
    task.remove
}

document.addEventListener("click", function(e){
    if(e.target.classList.contains("delete-task")){
        const task = e.target.closest(".task");
        if(task){
            task.remove();
            savetasklist();
        }
    }
});

document.addEventListener("dragover", function(e){
    e.preventDefault();
    const target = e.target.closest(".task");
    if(!target || target === draggedtask){
        return;
    }
    const list = document.getElementById("task-list");
    const tasks = [...list.children];

    const draggedindex = tasks.indexOf(draggedtask);
    const targetindex = tasks.indexOf(target);
    if(draggedindex < targetindex){
        list.insertBefore(draggedtask,target.nextSibling);
    }else{
        list.insertBefore(draggedtask, target);
    }
});

document.addEventListener("dragend", function(){
    savetasklist();
});

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

document.addEventListener("click", function(e){
    if(e.target.classList.contains("complete-task")){
        const task = e.target.closest(".task");

        if(task){
            task.classList.toggle("completed");
            savetasklist();
        }
    }
});

document.addEventListener("click", function(e){
    if(e.target.classList.contains("edit-task")){
        const task = e.target.closest(".task");

        if(!task){
            return;
        }

        const nameelement = task.querySelector(".task-content strong");
        const deadlineelement = task.querySelector(".task-content span");

        const taskname = prompt(
            "Enter new task name:",
            nameelement.textContent
        );

        if(taskname == null || taskname.trim() === ""){
            return;
        }

        const deadline = prompt(
            "Deadline:",
            deadlineelement.textContent.replace("Deadline : ", "")
        );

        if(deadline == null || deadline.trim() === ""){
            return;
        }

        nameelement.textContent = taskname;
        deadlineelement.textContent = "Deadline : " + deadline;

        savetasklist();
    }
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
loadtasklist();


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