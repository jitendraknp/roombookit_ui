setTimeout(() => {


    document.addEventListener('DOMContentLoaded', function () {
        var el = document.getElementById('sidebarCollapse');
        if (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault()
                $('#sidebar').toggleClass('active');
                $('#content').toggleClass('active');
            });
        }
        // Sidebar Toggle Script
        // $('#sidebarCollapse').click(function () {
        //     $('#sidebar').toggleClass('active');
        //     $('#content').toggleClass('active');
        // });

        $('.more-button,.body-overlay').on('click', function () {
            $('#sidebar,.body-overlay').toggleClass('show-nav');
        });

    });
    document.addEventListener('load', function () {
        var el = document.getElementById('sidebarCollapse');
        if (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault()
                $('#sidebar').toggleClass('active');
                $('#content').toggleClass('active');
            });
        }
        // Sidebar Toggle Script
        // $('#sidebarCollapse').click(function () {
        //     $('#sidebar').toggleClass('active');
        //     $('#content').toggleClass('active');
        // });

        $('.more-button,.body-overlay').on('click', function () {
            $('#sidebar,.body-overlay').toggleClass('show-nav');
        });

    });
}, 2000);
