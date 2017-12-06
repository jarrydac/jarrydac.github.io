const parts = [
    {
        name: "Left Arm",
        draw: 20,
        src: "l-arm.png",
        opacity: 0
    },

    {
        name: "Right Arm",
        draw: 20,
        src: "r-arm.png",
        opacity: 0
    },

    {
        name: "Left Leg",
        draw: 30,
        src: "l-leg.png",
        opacity: 0
    },

    {
        name: "Right Leg",
        draw: 30,
        src: "r-leg.png",
        opacity: 0
    },
];

(function(){
    var c = document.getElementById("canv");
    var canv = c.getContext("2d");

    var goal = 60;
    var maxGoal = 120;

    var rate = 0;
    var time = 60;
    var hits = goal;

    var opacity = 0;

    var game = false;
    var game_time = 20 * 60;
    var wait = 180;

    var fault = 0;
    var dead = 0;

    var body = new Image();
    body.src = 'body.png';

    var vessals = new Image();
    vessals.src = 'vessals.png';

    for(var i = 0; i < parts.length; i++){
        parts[i].mask = new Image();
        parts[i].mask.src = parts[i].src;
        parts[i].active = false;
    }

    /* Render */
    setInterval(function(){

        wait--;

        if(game == false){
            canv.clearRect(0,0,500,500)

            canv.font = "20px helvetica";
            canv.fillStyle = "rgba(0,0,0,1)";
            canv.textAlign = "center";
            canv.fillText("Press Space to Start!", 250, 450);

            if(game_time < 0){
                canv.font = "30px helvetica";
                canv.textAlign = "center";

                canv.fillText("You had an inaccuracy of: " + Math.round(fault), 250, 200);
                canv.fillText("You score was: " + Math.round((dead / 1200) * 100) + "%", 250, 300);
            }

            return;
        }

        if(game_time < 0){
            game = false;
            wait = 180;
            return;
        }

        var goalLen = game_time / (20 * 60);

        game_time--;

        canv.clearRect(0,0,500,500)

        canv.fillStyle = "darkred"
        canv.fillRect(25, 10, 450, 20)
        canv.fillStyle = "red"
        canv.fillRect(25, 10, (450 / 1200) * game_time , 20)

        /* Render Body */

        canv.drawImage(body,0,0);

        opacity--;

        if(opacity < 0){
            opacity = 0;
        }

        canv.globalAlpha = opacity / 10;
            canv.drawImage(vessals,0,0);

        canv.globalAlpha = 1;

        for(var i = 0; i < parts.length; i++){
            var mask = parts[i].mask;
            var opac = parts[i].opacity;

            canv.globalAlpha = opac / 20;
                canv.drawImage(mask,0,0);
            canv.globalAlpha = 1;
        }

        /* Render UI */

        canv.font = "20px helvetica";
        canv.fillStyle = "black";
        canv.textAlign = "center";
        canv.fillText("BPM Goal:", 100, 75);

        canv.font = "50px helvetica";
        canv.fillStyle = "black";
        canv.textAlign = "center";
        canv.fillText("" + goal, 100, 130);

        canv.font = "20px helvetica";
        canv.fillStyle = "black";
        canv.textAlign = "center";
        canv.fillText("Current BPM:", 400, 75);

        canv.font = "50px helvetica";
        canv.fillStyle = (rate > goal + 5 || rate < goal - 5 ? "red" : "black");
        canv.textAlign = "center";
        canv.fillText("" + Math.round(rate), 400, 130);

        if(rate > goal + 5 || rate < goal - 5){
            dead--;
        }
    }, 16);

    /* Calculate Clicks per Minute */
    setInterval(function(){
        if(!game){return;}

        rate = hits * (60 / time)
        fault += Math.abs(goal - rate);

        time += 1;

        if(time > 10){
            time /= 1.5;
            hits /= 1.5;
        }
    }, 1000);

    // Set the goal properly */

    /*setInterval(function(){
        var inc = 0;

        for(var i = 0; i < parts.length; i++){
            if(parts[i].active){
                inc+=parts[i].draw;
            }
        }

        if(goal != 60+inc){
            goal = 60+inc;
            time = 60;
            hits = goal;
        }

    }, 100);*/


    /*
    setInterval(function(){
        for(var i = 0; i < parts.length; i++){
            if(parts[i].active){
                parts[i].opacity -= 1;

                if(parts[i].opacity < 5){
                    parts[i].opacity = 15;
                }
            }else{
                parts[i].opacity = 0;
            }
        }
    }, 100);*/

    document.onkeydown = function() {
        switch (event.keyCode) {
            case 32:
                hits++;
                opacity = 10;

                if(game == false){
                    if(wait < 0){
                        game = true;
                        game_time = 1200;
                        dead = 1200;
                        fault = 0;
                        time = 60;
                        hits = goal;
                    }
                }
                break;
        }
    };
})();
