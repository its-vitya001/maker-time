$(document).ready(() => {
    let isSettingsOpen = false;
    $("#settings-icon").click(() => {
        isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen) {
           $("#settings-icon").animate({transform: "rotate(360deg)"}, 200, ()=>{}) 
        } else {
            $("#settings-icon").animate({transform: "rotate(360deg)"}, 200, ()=>{}) 
        }
    })
})