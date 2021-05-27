document.body.style.backgroundColor = '#1998d5';

let from = $("#from");
let to = $("#to");

// Filling options
for(i = 0; i <=23; i++){
    from.append(`<option>${i}:00</option>`);
    to.append(`<option>${i}:00</option>`);
}

chrome.storage.sync.get("values", ({ values }) => {
    from.val(`${values.from}:00`);
    to.val(`${values.to}:00`);
});

//buttons
let filterBtn = document.getElementById("filter");
let showAllBtn = document.getElementById("show-all");

filterBtn.addEventListener("click", async () => {
    // getting user times
    let from = $("#from").val();
    let to = $("#to").val();
    from = from.substring(0,2);
    to = to.substring(0,2);
    from = from.replace(":","");
    to = to.replace(":","");
    let times = [from, to];

    let values = {
        enableScroll: true,
        from: from,
        to: to}

    chrome.storage.sync.set({ values });
    window.close();

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: filter
    });
});

function filter(){
    if($("section").length > 0){
        let sections = $("section")[4];
        sections.addEventListener("scroll", scrollFilter);
    }

    function scrollFilter(){
        getValue(function (value) {
            let enableScroll = value['values'].enableScroll;
            let from = value['values'].from;
            let to = value['values'].to;

            if(enableScroll){
                let articles = $("article");
                for(i = 0; i < articles.length; i++){
                    let time = articles[i].children[1].children[3].innerText;
                    time = parseInt(time.substring(0,2));
                    from = parseInt(from);
                    to = parseInt(to);
                    if(from <= to){
                        if(time < from || time >= to){
                            let tmp = articles[i];
                            $(tmp).parent().parent().hide();
                        }
                    }
                    else{
                        if(time < from && time >= to){
                            let tmp = articles[i];
                            $(tmp).parent().parent().hide();
                        }
                    }
                }
            }
        });
    }

    function getValue(scrollFilter) {
        chrome.storage.sync.get("values", scrollFilter);
    }
}


showAllBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showAll
    });
    window.close();
});

function showAll(){
    let hiddenEvents = $('div[style="display: none;"]');
    hiddenEvents.show();

    let values = {
        enableScroll: false,
        from: 0,
        to: 0}
    chrome.storage.sync.set({ values });
};