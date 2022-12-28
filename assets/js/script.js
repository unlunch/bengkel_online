let limit = 4;
let start = 0;
let action = "inactive";
let name = "";
let type = "";
let result = 1;
let img = "";
let img_edit = null;
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
            name = $("#search").val();
            start = 0;
            lazzy_loader(limit);
            if (action == "inactive") {
                action = "active";
                setTimeout(function () {
                    fetch(limit, start, name, type);
                }, 1000);
            }
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
        text: "Moto Completa v.1.0",
        icon: "info",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#3085d6",
    });
}


function fetch(limit, start, name, type) {
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
                        <p class="bodytext2 color-black300 m-0 px-2" style ="color = var(--theme-gray-2) !important">${v.type}</p>
                        <p class="caption m-0 py-1 px-2 bodytext3">Rp.
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

function search() {
    $("#load_data").html("");
    start = 0;
    lazzy_loader(limit);
    action = "active";
    name = $("#search").val();
    setTimeout(function () {
        fetch(limit, start, name, type);
    }, 1000);
}

const setType = (newType) => {
    type = newType == "all" ? "" : newType;
    search()
}

function dialog(id) {
    $.ajax({
        url: "/api/catalog.php?f=edit",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(id),
        success: function (response) {
            if (response.data != null) {
                $("#modalEditCatalog").modal('show');
                $('#id').val(response.data.id);
                $('#btn-delete').attr({
                    'data-id': response.data.id
                });
                $('#name-edit').val(response.data.nama);
                $('#price-edit').val(response.data.harga);
                $('#type-edit').val(response.data.type).trigger('change');
            }
        },
    });
}

function createCatalog(data) {
    $.ajax({
        url: "/api/catalog.php?f=create",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            lazzy_loader(limit);
            action = "inactive";
            start = 0;
            name = "";
            $('form#create-catalog').trigger("reset");
            $("#modalCatalog").modal('hide');
            $("#load_data").html("");
            lazzy_loader(limit);
            if (action == "inactive") {
                action = "active";
                fetch(limit, start, name, type);
            }
        },
    });

}

function editCatalog(data) {
    Swal.fire("Sedang menyimpan data");
    Swal.showLoading();
    $.ajax({
        url: "/api/catalog.php?f=update",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status) {
                lazzy_loader(limit);
                action = "inactive";
                start = 0;
                name = "";
                img_edit = null;
                $('form#edit-catalog').trigger("reset");
                $('#custom-file-label-edit').html("Upload gambar...");
                $("#modalEditCatalog").modal('hide');
                $("#load_data").html("");
                lazzy_loader(limit);
                if (action == "inactive") {
                    action = "active";
                    fetch(limit, start, name, type);
                }
                Swal.fire({
                    text: response.message,
                    icon: "success",
                    confirmButtonColor: "#2a64eb",
                    confirmButtonText: "Ok",
                });
            } else {
                Swal.fire({
                    text: response.message,
                    icon: "error",
                    confirmButtonColor: "#2a64eb",
                    confirmButtonText: "Ok",
                });
            }
        }
    });
}



function deleteCatalog(e) {
    Swal.fire({
        text: "Apakah anda yakin ingin menghapus data ini?",
        icon: "warning",
        confirmButtonColor: "#2a64eb",
        confirmButtonText: "Yes",
        showDenyButton: true,
        denyButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/api/catalog.php?f=delete",
                type: "post",
                contentType: "application/json;",
                dataType: "json",
                data: JSON.stringify(e.dataset.id),
                success: function (response) {
                    if (response.status) {
                        lazzy_loader(limit);
                        action = "inactive";
                        start = 0;
                        name = "";
                        $("#modalEditCatalog").modal('hide');
                        $("#load_data").html("");
                        lazzy_loader(limit);
                        if (action == "inactive") {
                            action = "active";
                            fetch(limit, start, name, type);
                        }
                        Swal.fire({
                            text: response.message,
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                    } else {
                        Swal.fire({
                            text: response.message,
                            icon: "error",
                            confirmButtonText: "Ok",
                        });
                    }
                },
            });
        }
    });
}