$("#app").hide();
$("#sidebar-content").hide()
$(".burger-btn").hide()
$("#overlays").hide()

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
    $("#overlays").keydown((event) => {
        if (event.key === "Enter") {
            const noteName = $("#note-name").val().trim()

            if (noteName === "") return

            $("#note-name-pop-up").animate({opacity: "0"}, 100, () => {
                $("#note-name-pop-up").hide()
            })
            $("#overlays").animate({opacity: "0"}, 100, () => {
                $("#overlays").hide()

                $("#sidebar-content").append(`
                    <div class="note" id="${noteName}">
                        <p>${noteName}</p>
                        <button class="note-btn">...</button>
                    </div>
                `)

                $("#note-name").val("")
            })
        }
    })

    $("#add-note-btn").click(() => {
        $("#overlays").show().css("opacity", 0).animate({opacity: "1"}, 100)
        $("#note-name-pop-up").show().css("opacity", 0).animate({opacity: "1"}, 100)
    })
});