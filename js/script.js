/*
 * Author: J.Kim
*/

$(document).ready(function(){

    $('header').bigtext();

    var greeting = ["Hello there!", "Yo! ", "Hi ", "Morning!", "Evening guvnor", "Afternoon", "What's up?", "How are you?", "Good day to you", "Looking good!", "Nice haircut!", "Have you lost weight?", "It's been too long!", "Hey!" ];
    var old_rand_num = 0;

    // Random greeting
    $('#reload').click(function() {
        var rand_num = randNum();
        $('#header').text(greeting[rand_num]);
        $('header').bigtext();
        return false;
    });

    function randNum() {
        var rand_num = Math.floor(Math.random()*(greeting.length - 1)+1);
        if(rand_num == old_rand_num){
            rand_num = randNum();
        }
        old_rand_num = rand_num;
        return rand_num;
    }

});


