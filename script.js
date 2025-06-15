$("#app").hide();
$("#sidebar-content").hide()
$(".burger-btn").hide()

$("#overlays").hide()
$("#note-name-pop-up").hide()
$("#note-menu-pop-up").hide()
  
let notes_list_arr  = [];

// --- functions --- 
function renderSidebarNotes() {
    $("#sidebar-content").empty();

    for (let note of notes_list_arr) {
        const archivedStyles = note.isArchived

        $("#sidebar-content").append(`
            <div class="note" data-note-name="${note.name}" ${note.isArchived?"data-archived":""}>
                <p class="sidebar-note-name">${note.name}</p>
                <button class="note-btn">...</button>
            </div>
        `);
    }
}

function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes_list_arr));
}

function generateRgbByDate () {
    let date = new Date()
    let randomChoise = [
        date.getHours(), date.getSeconds(), date.getMinutes(),
        date.getMonth(), date.getDay(), date.getDate()
    ]
    function randomValue () {
        let n1 = randomChoise[Math.floor(Math.random()*randomChoise.length)]
        let n2 = randomChoise[Math.floor(Math.random()*randomChoise.length)]
        let n3 = randomChoise[Math.floor(Math.random()*randomChoise.length)]
        return (n1+n2+n3)/3
    }
    return `
        ${randomValue()*(Math.floor(Math.random()*128)/2)},
        ${randomValue()*(Math.floor(Math.random()*128)/2)},
        ${randomValue()*(Math.floor(Math.random()*128)/2)}
    `
}

// --- welcome screen hidding --- 

let isFirstVisit = !Boolean(localStorage.getItem("isFirstVisit"));

if (!isFirstVisit) {
    $("#welcome-screen-container").hide();
}

$(document).ready(() => {
    // --- welcome screen ---
    if (isFirstVisit) {
        $("#welcome-screen-start-btn").click(() => {
            localStorage.setItem("isFirstVisit", "false");
            $("#welcome-screen-container").animate({opacity: 0}, 100, () => {
                $("#welcome-screen-container").hide();

                setTimeout(() => {
                    $("#app").show(() => {
                        $("#app").animate({opacity: 1}, 100, ()=>{});
                    });
                }, 50);
            })
        })
    } else {
        $("#app").show(() => {
            $("#app").animate({opacity: 1}, 200, ()=>{});
        });
    }

    // --- notes loading from local storage ---
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        notes_list_arr = JSON.parse(savedNotes);
        renderSidebarNotes();
    }

    // --- burger menu animation ---
    let isSideBarOpen = false
     $("#burger-menu-icon").click(() => {
        isSideBarOpen = !isSideBarOpen;
        if (isSideBarOpen) {
            $(".burger-btn").show()
            $(".burger-btn").animate({opacity: 1}, 200, ()=>{})

            $("#sidebar-content").show()
            $("#sidebar").animate({width: "20vw"}, 400, ()=>{})
            $("#sidebar-content").animate({opacity: 1}, 450, ()=>{})
        } else {
            $(".burger-btn").animate({opacity: 0}, 200, ()=>{$(".burger-btn").hide()})

            $("#sidebar").animate({width: "3em"}, 400, ()=>{})
            $("#sidebar-content").animate({opacity: 0}, 200, ()=>{$("#sidebar-content").hide()})
        }
     })
     
    // --- note creating ---
    $("#add-note-btn").click(() => {
        $("#overlays").show().css("opacity", 0).animate({opacity: "1"}, 100)
        $("#note-name-pop-up").show().css("opacity", 0).animate({opacity: "1"}, 100)
    })

    let noteName;
    $("#overlays").keydown((event) => {
        if (event.key === "Enter") {
            noteName = $("#note-name-inp").val().trim()

            if (noteName === "" || noteName.match(/[0-9]/)) {
                alertify.error("invalid name !")
                return
            }

            $("#note-name-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-name-pop-up").hide()
            })

            $("#overlays").animate({opacity: "0"}, 100, () => {
                $("#overlays").hide()

                let date = new Date()
                const weekdaysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                notes_list_arr.push({
                    name: noteName,
                    text: "...",
                    dateWhenCreated: `${weekdaysName[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`,
                    timeWhenCreated: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    isArchived: false,
                });

                renderSidebarNotes();
                saveNotesToLocalStorage();

                console.log(notes_list_arr);

                $("#note-name-inp").val("")
            })
        }
    })

    // --- notes deleting & archiving ---
    $(document).on("click", ".note-btn", function (event) {
        event.stopPropagation();

        $("#overlays").show().css("opacity", 0).animate({opacity: "1"}, 100);
        $("#note-menu-pop-up").show().css("opacity", 0).animate({opacity: "1"}, 100);

        const noteElem = $(this).closest('.note');
        const noteName = noteElem.data("note-name");
        const note = notes_list_arr.find(n => n.name === noteName);

        if (!note) return;

        if (note.isArchived) {
            $("#archive-note-btn").text("unarchive").css("background", "rgb(207, 207, 207)");
        } else {
            $("#archive-note-btn").text("archive").css("background", "rgba(38, 84, 124, 0.8)");
        }

        $("#archive-note-btn").off("click").on("click", () => {
            note.isArchived = !note.isArchived;
            renderSidebarNotes();
            saveNotesToLocalStorage(); 

            $("#note-menu-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-menu-pop-up").hide();
                $("#overlays").animate({opacity: "0"}, 100, () => {
                    $("#overlays").hide();
                });
            });
        });

        $("#close-btn").off("click").on("click", () => {
            $("#note-menu-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-menu-pop-up").hide();
                $("#overlays").animate({opacity: "0"}, 100, () => {
                    $("#overlays").hide();
                });
            });
        });

        $("#delete-note-btn").off("click").on("click", () => {
            const index = notes_list_arr.findIndex(n => n.name === noteName);

            if (index !== -1) {
                notes_list_arr.splice(index, 1);
                renderSidebarNotes();
                saveNotesToLocalStorage(); 
            }

            $("#note-menu-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-menu-pop-up").hide();
                $("#overlays").animate({opacity: "0"}, 100, () => {
                    $("#overlays").hide();
                });
            });

        });
    });


    // --- note content creating ---
    $(document).on('click', '.note', function () {
        const noteName = $(this).attr("data-note-name");
        const note = notes_list_arr.find(n => n.name === noteName);
    
        if (!note) {
            console.warn(`Нет заметки с именем "${noteName}"`);
            return;
        }
        
        $("#main-workspace").html(`
            <div>
                <h1 class="note-heading" contenteditable="true" data-old-name="${note.name}">${note.name}</h1>
                <p class="note-main-text" contenteditable="true">${note.text}</p>
                <p class="note-creation-date" style="background: rgba(${generateRgbByDate()}, 0.5)">
                    Note creation date: ${note.dateWhenCreated}, at ${note.timeWhenCreated}
                </p>
            </div>
        `);
    });

    // --- reading / editing mode --- 
    let isEditingMode = true;
    $("#note-viewing-mode").click(function () {
        isEditingMode = !isEditingMode
        if (isEditingMode) {
            $(this).text("✎")
            $(".note-heading").attr("contenteditable", "true")
            $(".note-main-text").attr("contenteditable", "true")
        } else {
            $(this).text("📖")
            $(".note-heading").attr("contenteditable", "false")
            $(".note-main-text").attr("contenteditable", "false")
        }
    })

    $("#main-workspace").on("focusout", ".note-heading", function () {
        console.log("focus out");
    
        const $heading = $(this);
        const oldNoteName = $heading.data("old-name").trim();
        const newNoteName = $heading.text().trim();
    
        if (oldNoteName === newNoteName) {
            console.log("Имя не изменилось");
            return;
        }
    
        const note = notes_list_arr.find(n => n.name === oldNoteName);
        if (note) {
            note.name = newNoteName;
            renderSidebarNotes();
            $heading.data("old-name", newNoteName);
            saveNotesToLocalStorage(); 
    
            console.log(`old: ${oldNoteName}\nnew: ${newNoteName}`);
            console.log(note);
        }
    });

    $("#main-workspace").on("focusout", ".note-main-text", function () {
        const $text = $(this);
        const newText = $text.html().trim();

        const noteName = $(".note-heading").data("old-name").trim();
        const note = notes_list_arr.find(n => n.name === noteName);

        if (note) {
            note.text = newText;
            saveNotesToLocalStorage(); 
            console.log(`Текст заметки "${noteName}" обновлен:\n${newText}`);
        }
    });

});





// wtf 

function contrastLvl () {
    let bgColor =  "rgb(255, 255, 0)"
    let textColor = "rgb(255, 255, 255)"
    return bgColor.split(",")
}
console.log(contrastLvl)