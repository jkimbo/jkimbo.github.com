/*
 * Author: J.Kim
*/

$(document).ready(function(){

    $('header').bigtext();

    var greeting = [
        "Hello there!",
        "Yo! ",
        "Hi ",
        "Morning!",
        "Evening guvnor",
        "Afternoon",
        "What's up?",
        "How are you?",
        "Good day to you",
        "Looking good!",
        "Nice haircut!",
        "Have you lost weight?",
        "It's been too long!",
        "Hey!",
        "Bonjour!",
        "How do you do?",
        "How's life?",
        "How are things?",
        "Pleased to meet you",
        "Fancy seeing you here!",
        "Good day sir/madam",
        "G'day mate!",
        "Wassup?",
        "Hiya!",
        "Ey up!",
        "Greetings!",
        "Salutations"
    ];

    var old_rand_num_array = [];

    // Random greeting
    $('#reload').click(function() {
        var rand_num = randNum();
        $('#header').text(greeting[rand_num]);
        $('header').bigtext();
        return false;
    });

    function randNum() {
        var rand_num = Math.floor(Math.random()*(greeting.length - 1));
        if($.inArray(rand_num, old_rand_num_array) !== -1){
            rand_num = randNum();
        }
        old_rand_num_array.push(rand_num);
        if(old_rand_num_array.length > (greeting.length*0.8)){
            old_rand_num_array = old_rand_num_array.slice(1);
        }
        console.log(old_rand_num_array);
        return rand_num;
    }

});


