$("#app").hide();

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
            $(".sidebar").animate({width: "30vw"}, 400, () => {})
            setTimeout(() => {
                $(".content").show()
            }, 200);
        } else {
            $(".sidebar").animate({width: "0"}, 400, () => {$(".content").hide()})
        }
     })
});