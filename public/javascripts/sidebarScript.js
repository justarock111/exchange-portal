$(document).ready(function(){
    $(".group li").each(function(){
        $(this).click(function() {
         localStorage.setItem('activeSection', $(this).attr("id"));
        })

    });
    var activeSection = localStorage.getItem('activeSection');
    activeSection = $('#' + activeSection).length !== 0? activeSection: "first-section";
    console.log("ACTIVE SECTION IS ");
    console.log($('#' + activeSection));

    $(".focus").removeClass("focus");
    $('#' + activeSection).addClass("focus");

});
