/*
 * Author: J.Kim
*/

$(document).ready(function(){

    // Add your jQuery here
    $('header').bigtext();

    $('#reload').click(function() {
        var greeting = ["Hello there!", "Yo! ", "Hi ", "Morning!", "Evening guvnor", "Afternoon", "What's up?", "How are you?", "Good day to you" ];
        console.log(Math.floor(Math.random()*(greeting.length - 1))+1);
        $('#header').text(greeting[Math.floor(Math.random()*(greeting.length - 1))]);
        $('header').bigtext();
        return false;
    });
});


