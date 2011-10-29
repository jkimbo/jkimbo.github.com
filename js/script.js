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

    var error = [
        "Oh poo!",
        "Goodness gracious great balls of fire!",
        "Well this is embarrassing...",
        "Errmm...",
        "F***ing hell!",
        "Oh man!",
        "Shoot!",
        "Dagnabbit!"
    ];

    var old_rand_num_array = [];

    // Random greeting
    $('#frontpage #reload').click(function() {
        var rand_num = randNum(greeting);
        old_rand_num_array.push(rand_num);
        if(old_rand_num_array.length > (greeting.length*0.7)){
            old_rand_num_array = old_rand_num_array.slice(1);
        }
        $('#header').text(greeting[rand_num]);
        $('header').bigtext();
        return false;
    });
    
    // Random error
    $('#error #reload').click(function() {
        var rand_num = randNum(error);
        old_rand_num_array.push(rand_num);
        if(old_rand_num_array.length > (error.length*0.7)){
            old_rand_num_array = old_rand_num_array.slice(1);
        }
        $('#header').text(error[rand_num]);
        $('header').bigtext();
        return false;
    });

    function randNum(array) {
        var rand_num = Math.floor(Math.random()*(array.length));
        if($.inArray(rand_num, old_rand_num_array) !== -1 ){ // if number is in array
            return randNum(array);
        } else { // number is not in array
            return rand_num;
        }
    }
});

