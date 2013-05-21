$(function () {
    var socket = io.connect('http://localhost:9090/');

    socket.on('result', function (data) {
        console.log(data);
        $('#result').html($('#result').html() + data['result']);
    });

    $('#query-button').on('click', function (event) {
        $.ajax({
            type: "POST",
            url:  "/api/queries",
            data: { query: $('#query').val() }
        });
    });
});
