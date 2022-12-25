let limit = 4;
let start = 0;
let action = "inactive";
let name = "";
let type = "";
let result = 1;
let all_data = 0;

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
            fetch(limit, start, name, type);
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


function fetch(limit, start, name, type, ) {
    $.ajax({
        url: "/api/catalog.php?f=search",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify({
            limit: limit,
            start: start,
            search: {
                name: name,
                type: type
            },
        }),
        success: function (response) {
            result = response.result;
            all_data = response.all_data;
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

function lazzy_loader(limit) {
    var output = "";
    for (var count = 0; count < limit; count++) {
        output += `
        <a class="product-items w-50 flex-column shimmer"
        href="javascript:void(0)">
        <div class="product-cover animate mb-2" ></div>
        <p class="bodytext1 semibold m-0 px-2 text-secondary animate
        mb-2"></p>
        <p class="bodytext2 color-black300 m-0 px-2 animate mb2"></p>
        <p class="caption m-0 py-1 px-2 text-primary animate"></p>
        </a>`;
    }
    $("#load_data_message").html(output);
}

$(window).scroll(function () {
    if (
        $(window).scrollTop() + $(window).height() > $("#load_data").height() &&
        action == "inactive" &&
        result == 1 &&
        all_data > (start + limit)
    ) {
        lazzy_loader(limit);
        action = "active";
        start = start + limit;
        name = $("#search").val();
        setTimeout(function () {
            fetch(limit, start, name, type);
        }, 1000);
    }
});