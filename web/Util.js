// m = 1 => increase, other => reduced
var g_count_tu = 0;
var g_count_tf = 0;
var g_count_tt = 0
const mins = new Intl.NumberFormat(
    "en-US",
    {
        minimumIntegerDigits: 2
    }
);
function setChangeTrashStatus(id, val) {
    let obj = $(`#${id}`);
    obj.text(`${val}`);
}
function updateTrashStatus(arr) {
    g_count_tt = arr.length;
    g_count_tu = 0;
    g_count_tf = 0;
    setChangeTrashStatus('num_tt', g_count_tt);
    setChangeTrashStatus('num_tu', g_count_tu);
    setChangeTrashStatus('num_tf', g_count_tf);
    arr.forEach(el => {
        if (el.status == 0) {
            g_count_tu++;
            setChangeTrashStatus('num_tu', g_count_tu);
        } else if (el.status == 1){
            g_count_tf++;
            setChangeTrashStatus('num_tf', g_count_tf);
        }
    });
    const d = new Date();
    const __month = d.getMonth()+1;
    const day = mins.format(d.getDate());
    const month = mins.format(d.getMonth()+1);

    let date = `${d.getHours()}:${d.getMinutes()} (${day}/${month})`;
    $('#num_date').text(date);
}
// show modal
function showAlert(content) {
    $('.modal-body').text(content);
    myModal.show();
}
var tout;
function showNoti(content) {
    var x = document.getElementById("snackbar");
    if (x.className=='show') {
        x.className = x.className.replace("show", "");
        clearTimeout(tout);
    }
    x.innerText = content;
    x.className = "show";
    tout = setTimeout(function(){
        x.className = x.className.replace("show", "");
    }, 2000);
}