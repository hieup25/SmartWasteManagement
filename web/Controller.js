function adjustElement() {
    let w_scale = $('#el2').width() / 338.063;
    $('.bg-btn-dashboard').width(w_scale * 100).height(w_scale * 100); // 100 size origin
    $('.icon-btn-dashboard').width(w_scale* 70).height(w_scale * 75);
    $(window).resize(function() {
        let w_scale = $('#el2').width() / 338.063;
        $('.bg-btn-dashboard').width(w_scale * 100).height(w_scale * 100); // 100 size origin
        $('.icon-btn-dashboard').width(w_scale * 70).height(w_scale * 75);
    });
}
function InitWeb() {
    $("div[name='tabmap']").css('height', window.innerHeight);
    $(window).resize(function() {
        $("div[name='tabmap']").css('height', window.innerHeight);
    });
    $("div[index-content]").hide();
    $("div[name='item-menu']").css('opacity', 0.3);
    //default home
    $("div[active]").css('opacity', 1);
    $("div[index-content='1']").show();
    //
    $("div[name='item-menu']").click(function() {
        $("div[name='item-menu']").css('opacity', 0.3);
        $(this).css('opacity', '1');
    });
    $("#version").html(`<i>Ver: 1.0/${L.version} - Build 24/10/2022</i>`);
    adjustElement();
}
function SwitchTab(index) {
    var title = document.getElementById('title_main');
    var detail = document.getElementById('detail');
    $("div[index-content]").hide();
    switch (index) {
        case 1: {
            title.innerText ='Home';
            detail.innerText ='Status, location trash on the map. Also add edit and delete trash';
            $("div[index-content='1']").show();     
            break;  
        }
        case 2: {
            title.innerText ='Analyze';
            detail.innerText ='Data analysis results when using the system';
            $("div[index-content='2']").show();
            break;
        }
        default: {
            title.innerText ='Setting';
            detail.innerText ='System modification and maintenance';
            $("div[index-content='3']").show();
            break;
        }
    }
}