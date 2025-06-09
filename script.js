$("#app").hide();

let isFirstVisit = !Boolean(localStorage.getItem("isFirstVisit"));
console.log(isFirstVisit);

if (!isFirstVisit) {
    $("#welcome-screen").hide();
}

$(document).ready(() => {
    if (isFirstVisit) {
        $("#welcome-screen-start-btn").click(() => {
            localStorage.setItem("isFirstVisit", "false");
            $("#welcome-screen").animate({opacity: 0}, 100, () => {
                $("#welcome-screen").hide();

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
});