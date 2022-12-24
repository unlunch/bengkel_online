function navigation(id) {
    $(".fill-nav").removeClass("footer-active")
    $("#" + id).addClass("footer-active")
}
// saat aplikasi pertama dijalankan , konten home akan langsung dibuka
$(document).ready(function () {
    home();
    $("#home").addClass("active");
    $("#catalog").removeClass("active");
    $("#profil").removeClass("active");
});
//fungsi ini digunakan sebagai router halaman konten home
function home() {
    navigation('home');

    $.ajax({
        type: "GET",
        url: "home.html",
        success: function (response) {
            $("#content").html(response);
        },
    });
}

function catalog() {
    navigation('catalog');

    $.ajax({
        type: "GET",
        url: "catalog.html",
        success: function (response) {
            $("#content").html(response);
            fetch();
        },
    });
}

function booking() {
    navigation('booking');

    $.ajax({
        type: "GET",
        url: "booking.html",
        success: function (response) {
            $("#content").html(response);
        },
    });
}

function info() {
    swal.fire({
        title: "Info",
        text: "Apps Toko Online v.1.0",
        icon: "info",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#3085d6",
    });
}


function fetch() {
    $.ajax({
        url: "/api/catalog.php?f=search",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: "",
        success: function (response) {
            // result = response.result;
            // all_data = response.all_data;
            if (response.status) {
                let card_data = "";
                $.each(response.data, function (i, v) {
                    card_data = ` <a class="product-items w-50 flex-column"
                        href="javascript:void(0)" onclick="dialog('${v.id}');">
                        <div class="product-cover mb-2" style="background-image:
                        url('${v.image}');"></div>
                        <p class="bodytext1 semibold m-0 px-2 text-secondary">${v.nama}</p>
                        <p class = "bodytext2 color-black300 m-0 px-2">${v.type}</p>
                        <p class="caption m-0 py-1 px-2 text-primary">Rp.
                        ${numFormat(v.harga)}</p>
                    </a>`;
                    $("#load_data").append(card_data);
                });
                action = "inactive";
                $("#load_data_message").html("");
            } else {
                $("#load_data").html("");
                $("#load_data_message").html(
                    '<div class="col-12 text-center"><h4 class="text-danger">Oops, barang yang anda cari tidak di temukan</h4 ></div > '
                );
                action = "active";
            }
        },
    });
}

function numFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}