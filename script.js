/*
==================================================
GOOGLE APPS SCRIPT URL
==================================================
*/

const API_URL =
"https://script.google.com/macros/s/XXXXXXXXXXXX/exec";


/*
==================================================
DATA PEMAIN
==================================================
*/

let username = "";
let whatsapp = "";

let score = 0;
let gameTime = 30;

let gameRunning = false;

let timer = null;


/*
==================================================
CANVAS
==================================================
*/

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/*
==================================================
PLAYER
==================================================
*/

const player = {

    x: 225,

    y: 520,

    width: 50,

    height: 50,

    speed: 7

};


/*
==================================================
COIN
==================================================
*/

let coin = {

    x: 100,

    y: 100,

    size: 25

};


/*
==================================================
KEYBOARD
==================================================
*/

const keys = {};


document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key] = true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key] = false;

    }
);


/*
==================================================
START GAME
==================================================
*/

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    username =
        document
            .getElementById("username")
            .value
            .trim();

    whatsapp =
        document
            .getElementById("whatsapp")
            .value
            .trim();


    if (!username) {

        showMessage(
            "Username wajib diisi"
        );

        return;
    }


    if (!whatsapp) {

        showMessage(
            "Nomor WhatsApp wajib diisi"
        );

        return;
    }


    score = 0;

    gameTime = 30;

    player.x = 225;

    player.y = 520;

    randomCoin();


    document
        .getElementById("menuScreen")
        .classList
        .add("hidden");


    document
        .getElementById("leaderboardScreen")
        .classList
        .add("hidden");


    document
        .getElementById("gameScreen")
        .classList
        .remove("hidden");


    document
        .getElementById("score")
        .textContent = score;


    document
        .getElementById("time")
        .textContent = gameTime;


    gameRunning = true;


    clearInterval(timer);


    timer = setInterval(
        function() {

            gameTime--;

            document
                .getElementById("time")
                .textContent =
                gameTime;


            if (gameTime <= 0) {

                endGame();

            }

        },
        1000
    );


    requestAnimationFrame(
        gameLoop
    );
}


/*
==================================================
GAME LOOP
==================================================
*/

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );
}


/*
==================================================
UPDATE
==================================================
*/

function update() {

    if (
        keys["ArrowLeft"] ||
        keys["a"] ||
        keys["A"]
    ) {

        player.x -=
            player.speed;

    }


    if (
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["D"]
    ) {

        player.x +=
            player.speed;

    }


    if (
        keys["ArrowUp"] ||
        keys["w"] ||
        keys["W"]
    ) {

        player.y -=
            player.speed;

    }


    if (
        keys["ArrowDown"] ||
        keys["s"] ||
        keys["S"]
    ) {

        player.y +=
            player.speed;

    }


    /*
    BATAS CANVAS
    */

    if (player.x < 0) {

        player.x = 0;

    }


    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    if (player.y < 0) {

        player.y = 0;

    }


    if (
        player.y +
        player.height >
        canvas.height
    ) {

        player.y =
            canvas.height -
            player.height;

    }


    /*
    CEK TABRAKAN
    */

    if (

        player.x <
        coin.x + coin.size &&

        player.x +
        player.width >
        coin.x &&

        player.y <
        coin.y + coin.size &&

        player.y +
        player.height >
        coin.y

    ) {

        score += 10;


        document
            .getElementById("score")
            .textContent =
            score;


        randomCoin();

    }

}


/*
==================================================
DRAW
==================================================
*/

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    BACKGROUND
    */

    ctx.fillStyle =
        "#020617";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    GRID
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";


    for (
        let x = 0;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }


    /*
    PLAYER
    */

    ctx.fillStyle =
        "#3b82f6";


    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );


    /*
    MATA PLAYER
    */

    ctx.fillStyle =
        "white";


    ctx.fillRect(
        player.x + 12,
        player.y + 12,
        7,
        7
    );


    ctx.fillRect(
        player.x + 31,
        player.y + 12,
        7,
        7
    );


    /*
    COIN
    */

    ctx.beginPath();


    ctx.arc(
        coin.x +
            coin.size / 2,

        coin.y +
            coin.size / 2,

        coin.size / 2,

        0,

        Math.PI * 2
    );


    ctx.fillStyle =
        "#facc15";


    ctx.fill();

}


/*
==================================================
RANDOM COIN
==================================================
*/

function randomCoin() {

    coin.x =
        Math.random() *
        (canvas.width -
         coin.size);


    coin.y =
        Math.random() *
        (canvas.height -
         coin.size);

}


/*
==================================================
END GAME
==================================================
*/

function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearInterval(timer);


    alert(
        "GAME SELESAI!\n\n" +
        "Username: " +
        username +
        "\nScore: " +
        score
    );


    saveScore();

}


/*
==================================================
SAVE SCORE
==================================================
*/

async function saveScore() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            username:
                                username,

                            whatsapp:
                                whatsapp,

                            score:
                                score

                        })
                }
            );


        const result =
            await response.json();


        console.log(
            "Save result:",
            result
        );


    } catch (error) {

        console.error(
            "Gagal menyimpan score:",
            error
        );

    }

}


/*
==================================================
LEADERBOARD
==================================================
*/

document
    .getElementById(
        "leaderboardButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


async function showLeaderboard() {

    document
        .getElementById("menuScreen")
        .classList
        .add("hidden");


    document
        .getElementById("gameScreen")
        .classList
        .add("hidden");


    document
        .getElementById(
            "leaderboardScreen"
        )
        .classList
        .remove("hidden");


    const leaderboard =
        document.getElementById(
            "leaderboard"
        );


    leaderboard.innerHTML =
        "⏳ Memuat leaderboard...";


    try {

        const response =
            await fetch(
                API_URL +
                "?action=leaderboard"
            );


        const data =
            await response.json();


        if (
            !data.success ||
            data.leaderboard.length === 0
        ) {

            leaderboard.innerHTML =
                "<p>Belum ada pemain.</p>";

            return;

        }


        leaderboard.innerHTML = "";


        data.leaderboard
            .forEach(
                function(
                    player,
                    index
                ) {

                    const row =
                        document
                            .createElement(
                                "div"
                            );


                    row.className =
                        "rank";


                    row.innerHTML = `

                        <div
                            class="rank-number">
                            #${index + 1}
                        </div>

                        <div
                            class="rank-name">
                            ${escapeHTML(
                                player.username
                            )}
                        </div>

                        <div
                            class="rank-score">
                            ${player.score}
                        </div>

                    `;


                    leaderboard
                        .appendChild(
                            row
                        );

                }
            );


    } catch (error) {

        leaderboard.innerHTML =
            "<p>❌ Gagal mengambil leaderboard.</p>";


        console.error(error);

    }

}


/*
==================================================
MENU
==================================================
*/

document
    .getElementById(
        "gameMenuButton"
    )
    .addEventListener(
        "click",
        backToMenu
    );


document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        backToMenu
    );


function backToMenu() {

    gameRunning = false;

    clearInterval(timer);


    document
        .getElementById(
            "gameScreen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "leaderboardScreen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "menuScreen"
        )
        .classList
        .remove("hidden");

}


/*
==================================================
MESSAGE
==================================================
*/

function showMessage(message) {

    document
        .getElementById(
            "menuMessage"
        )
        .textContent =
        message;

}


/*
==================================================
ESCAPE HTML
==================================================
*/

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}


/*
==================================================
KONTROL TOUCH / HP
==================================================
*/

const controlButtons =
    document.querySelectorAll(
        ".control"
    );


controlButtons.forEach(
    function(button) {

        const key =
            button.dataset.key;


        button.addEventListener(
            "touchstart",
            function(event) {

                event.preventDefault();

                keys[key] = true;

            }
        );


        button.addEventListener(
            "touchend",
            function(event) {

                event.preventDefault();

                keys[key] = false;

            }
        );


        button.addEventListener(
            "mousedown",
            function() {

                keys[key] = true;

            }
        );


        button.addEventListener(
            "mouseup",
            function() {

                keys[key] = false;

            }
        );


        button.addEventListener(
            "mouseleave",
            function() {

                keys[key] = false;

            }
        );

    }
);
