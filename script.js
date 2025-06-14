$("#app").hide();
$("#sidebar-content").hide()
$(".burger-btn").hide()

$("#overlays").hide()
$("#note-name-pop-up").hide()
$("#note-menu-pop-up").hide()
  
// !--- Test varibales & logs zone ---! 
let notes_list_arr  = [];

function renderSidebarNotes() {
    $("#sidebar-content").empty(); // очистить

    for (let note of notes_list_arr) {
        const archivedStyles = note.isArchived
            ? 'style="background: none; border: solid 1px lightgray; text-decoration: line-through; color: gray;"'
            : '';

        $("#sidebar-content").append(`
            <div class="note" data-note-name="${note.name}" ${archivedStyles}>
                <p class="sidebar-note-name">${note.name}</p>
                <button class="note-btn">...</button>
            </div>
        `);
    }
}

function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes_list_arr));
}



let isFirstVisit = !Boolean(localStorage.getItem("isFirstVisit"));
console.log(isFirstVisit);

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

    // notes loading from local storage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        notes_list_arr = JSON.parse(savedNotes);
        renderSidebarNotes();
    }

    // --- sidebar ---
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

            if (noteName === "") return

            $("#note-name-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-name-pop-up").hide()
            })

            $("#overlays").animate({opacity: "0"}, 100, () => {
                $("#overlays").hide()

                let date = new Date()
                const weekdaysName = [null, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const monthNames = [null, 
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                notes_list_arr.push({
                    name: noteName,
                    text: "your text",
                    dateWhenCreated: `${weekdaysName[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`,
                    timeWhenCreated: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    isArchived: false,
                });

                renderSidebarNotes();
                saveNotesToLocalStorage(); // <--- ✅ ДОБАВЬ ЭТО

                console.log(notes_list_arr);

                $("#note-name-inp").val("")
            })
        }
    })

    

    // --- notes removing & archiving ---
    $(document).on("click", ".note-btn", function (event) {
        event.stopPropagation();

        $("#overlays").show().css("opacity", 0).animate({opacity: "1"}, 100);
        $("#note-menu-pop-up").show().css("opacity", 0).animate({opacity: "1"}, 100);

        const noteElem = $(this).closest('.note');
        const noteName = noteElem.data("note-name");
        const note = notes_list_arr.find(n => n.name === noteName);

        if (!note) return;

        // Синхронизируем кнопку с текущим состоянием
        if (note.isArchived) {
            $("#archive-note-btn").text("unarchive").css("background", "rgb(207, 207, 207)");
        } else {
            $("#archive-note-btn").text("archive").css("background", "rgba(38, 84, 124, 0.8)");
        }

        $("#archive-note-btn").off("click").on("click", () => {
            note.isArchived = !note.isArchived;
            renderSidebarNotes(); // Перерисовать с актуальным стилем
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

            // обработчик кнопки удаления
    $("#delete-note-btn").off("click").on("click", () => {
            // 1. найти индекс заметки
        const index = notes_list_arr.findIndex(n => n.name === noteName);

        if (index !== -1) {
            notes_list_arr.splice(index, 1); // 2. удалить из массива
            renderSidebarNotes();            // 3. перерисовать список
            saveNotesToLocalStorage(); 
        }

            // 4. закрыть попап
        $("#note-menu-pop-up").animate({opacity: "0"}, 100, () => {
            $("#note-menu-pop-up").hide();
            $("#overlays").animate({opacity: "0"}, 100, () => {
                $("#overlays").hide();
            });
        });

    });
});


    // --- note content creating ---
    
    // Клик по заметке — отрисовка в рабочей области
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
                <p class="note-creation-date">
                    Note creation date: ${note.dateWhenCreated}, at ${note.timeWhenCreated}
                </p>
            </div>
        `);
    });

    // reading / editing mode 
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

        const noteName = $(".note-heading").data("old-name").trim(); // имя из заголовка
        const note = notes_list_arr.find(n => n.name === noteName);

        if (note) {
            note.text = newText;
            saveNotesToLocalStorage(); 
            console.log(`Текст заметки "${noteName}" обновлен:\n${newText}`);
        }
    });
});