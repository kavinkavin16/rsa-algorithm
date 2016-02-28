$(document).ready(function() {
    $(document).on('click', ':not(.dropdown *)', function (e) {
        e.stopPropagation();
        $('#menu-dropdown').removeClass("open");
    });
    closemodal = function(modal) {
        $(modal).modal('hide')
    };
});