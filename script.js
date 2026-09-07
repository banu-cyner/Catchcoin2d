/* =====================================================
   CATCH THE COIN - GAME.JS
   ===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT
   GANTI URL DI BAWAH INI
   ===================================================== */

const API_URL =
    "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";


/* =====================================================
   DATA PEMAIN
   ===================================================== */

let username = "";
let whatsapp = "";

let score = 0;
let gameTime = 30;

let gameRunning = false;
let timer = null;


/* =====================================================
   ELEMENT HTML
   ===================================================== */

const menuScreen =
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");

const usernameInput =
    document.getElementById("username");

const whatsappInput =
    document.getElementById("whatsapp");

const scoreElement =
    document.getElementById("score");

const timeElement =
    document.getElementById("time");

const menuMessage =
    document.getElementById("menuMessage");

const leaderboardElement =
    document.getElementById("leaderboard");


/* =====================================================
   CANVAS
   ===================================================== */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =====================================================
   PLAYER
   ===================================================== */

const player = {

    x: 225,
    y: 520,

    width: 50,
    height: 50,

    speed: 7

};


/* =====================================================
   COIN
   ===================================================== */

const coin = {

    x: 100,
    y: 100,

    size: 28

};


/* =====================================================
   KEYBOARD / TOUCH
   ===================================================== */

const keys = {};


/* Keyboard */

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


/* =====================================================
   MULAI GAME
   ===================================================== */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    username =
        usernameInput.value.trim();

    whatsapp =
        whatsappInput.value.trim();


    /* Validasi username */

    if (username === "") {

        showMessage(
            "Username wajib diisi!"
        );

        usernameInput.focus();

        return;

    }


    /* Validasi WhatsApp */

    if (whatsapp === "") {

        showMessage(
            "Nomor WhatsApp wajib diisi!"
        );

        whatsappInput.focus();

        return;

    }


    /*
    Bersihkan pesan
    */

    menuMessage.textContent = "";


    /*
    Reset game
    */

    score = 0;

    gameTime = 30;

    player.x = 225;
    player.y = 520;


    /*
    Update tampilan
    */

    scoreElement.textContent =
        score;

    timeElement.textContent =
        gameTime;


    /*
    Pindah MENU -> GAME
    */

    menuScreen.classList.add(
        "hidden"
    );

    leaderboardScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    /*
    Buat coin baru
    */

    randomCoin();


    /*
    Mulai game
    */

    gameRunning = true;


    /*
    Hentikan timer lama
    */

    clearInterval(timer);


    /*
    Timer
    */

    timer = setInterval(
        function() {

            if (!gameRunning) {
                return;
            }


            gameTime--;


            timeElement.textContent =
                gameTime;


            if (gameTime <= 0) {

                endGame();

            }

        },
        1000
    );


    /*
    Jalankan game loop
    */

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   GAME LOOP
   ===================================================== */

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


/* =====================================================
   UPDATE GAME
   ===================================================== */

function update() {


    /* Kiri */

    if (
        keys["ArrowLeft"] ||
        keys["a"] ||
        keys["A"]
    ) {

        player.x -=
            player.speed;

    }


    /* Kanan */

    if (
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["D"]
    ) {

        player.x +=
            player.speed;

    }


    /* Atas */

    if (
        keys["ArrowUp"] ||
        keys["w"] ||
        keys["W"]
    ) {

        player.y -=
            player.speed;

    }


    /* Bawah */

    if (
        keys["ArrowDown"] ||
        keys["s"] ||
        keys["S"]
    ) {

        player.y +=
            player.speed;

    }


    /* =================================================
       BATAS CANVAS
       ================================================= */


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


    /* =================================================
       CEK TABRAKAN COIN
       ================================================= */

    const collision =

        player.x <
        coin.x + coin.size &&

        player.x +
        player.width >
        coin.x &&

        player.y <
        coin.y + coin.size &&

        player.y +
        player.height >
        coin.y;


    if (collision) {

        score += 10;


        scoreElement.textContent =
            score;


        randomCoin();

    }

}


/* =====================================================
   DRAW
   ===================================================== */

function draw() {


    /*
    Bersihkan canvas
    */

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    Background
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
    Grid
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.06)";


    for (
        let x = 0;
        x <= canvas.width;
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
        y <= canvas.height;
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


    /* =================================================
       COIN
       ================================================= */

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


    /*
    Lingkaran dalam coin
    */

    ctx.beginPath();

    ctx.arc(

        coin.x +
        coin.size / 2,

        coin.y +
        coin.size / 2,

        coin.size / 2 - 5,

        0,

        Math.PI * 2

    );

    ctx.strokeStyle =
        "#ca8a04";

    ctx.lineWidth = 2;

    ctx.stroke();


    /* =================================================
       PLAYER
       ================================================= */

    ctx.fillStyle =
        "#3b82f6";


    ctx.fillRect(

        player.x,
        player.y,

        player.width,
        player.height

    );


    /*
    Player outline
    */

    ctx.strokeStyle =
        "#93c5fd";

    ctx.lineWidth = 3;

    ctx.strokeRect(

        player.x,
        player.y,

        player.width,
        player.height

    );


    /*
    Mata
    */

    ctx.fillStyle =
        "white";


    ctx.fillRect(

        player.x + 11,
        player.y + 12,

        8,
        8

    );


    ctx.fillRect(

        player.x + 31,
        player.y + 12,

        8,
        8

    );


    /*
    Mulut
    */

    ctx.fillRect(

        player.x + 16,
        player.y + 32,

        18,
        4

    );

}


/* =====================================================
   RANDOM COIN
   ===================================================== */

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


/* =====================================================
   GAME OVER
   ===================================================== */

function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearInterval(timer);


    alert(
        "🎮 GAME SELESAI!\n\n" +
        "Player: " +
        username +
        "\n\n" +
        "Score: " +
        score
    );


    /*
    Simpan score
    */

    saveScore();

}


/* =====================================================
   SIMPAN SCORE KE GOOGLE SHEETS
   ===================================================== */

async function saveScore() {

    try {

        /*
        Tampilkan status
        */

        menuMessage.textContent =
            "⏳ Menyimpan score...";


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
            "Google Sheets:",
            result
        );


        if (result.success) {

            console.log(
                "Score berhasil disimpan."
            );

        }


    } catch (error) {

        console.error(
            "Gagal menyimpan score:",
            error
        );

    }


    /*
    Kembali ke menu
    */

    backToMenu();

}


/* =====================================================
   LEADERBOARD BUTTON
   ===================================================== */

document
    .getElementById(
        "leaderboardButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


/* =====================================================
   SHOW LEADERBOARD
   ===================================================== */

async function showLeaderboard() {


    /*
    Pindah ke leaderboard
    */

    menuScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    leaderboardScreen.classList.remove(
        "hidden"
    );


    leaderboardElement.innerHTML =
        "<p>⏳ Memuat leaderboard...</p>";


    try {

        const response =
            await fetch(
                API_URL +
                "?action=leaderboard"
            );


        const data =
            await response.json();


        if (
            !data.success
        ) {

            leaderboardElement.innerHTML =
                "<p>❌ Gagal mengambil data.</p>";

            return;

        }


        if (
            !data.leaderboard ||
            data.leaderboard.length === 0
        ) {

            leaderboardElement.innerHTML =
                "<p>🏆 Belum ada pemain.</p>";

            return;

        }


        /*
        Kosongkan leaderboard
        */

        leaderboardElement.innerHTML =
            "";


        /*
        Tampilkan ranking
        */

        data.leaderboard.forEach(
            function(
                playerData,
                index
            ) {


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "rank";


                row.innerHTML = `

                    <div class="rank-number">
                        #${index + 1}
                    </div>

                    <div class="rank-name">
                        ${escapeHTML(
                            playerData.username
                        )}
                    </div>

                    <div class="rank-score">
                        ${Number(
                            playerData.score
                        ).toLocaleString("id-ID")}
                    </div>

                `;


                leaderboardElement
                    .appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        leaderboardElement.innerHTML =
            "<p>❌ Tidak dapat terhubung ke server.</p>";

    }

}


/* =====================================================
   MENU GAME
   ===================================================== */

document
    .getElementById(
        "gameMenuButton"
    )
    .addEventListener(
        "click",
        backToMenu
    );


/* =====================================================
   BACK BUTTON
   ===================================================== */

document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        backToMenu
    );


/* =====================================================
   KEMBALI KE MENU
   ===================================================== */

function backToMenu() {

    gameRunning = false;


    clearInterval(timer);


    gameScreen.classList.add(
        "hidden"
    );


    leaderboardScreen.classList.add(
        "hidden"
    );


    menuScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   PESAN MENU
   ===================================================== */

function showMessage(message) {

    menuMessage.textContent =
        message;

}


/* =====================================================
   SECURITY
   ===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   KONTROL HP
   ===================================================== */

const controlButtons =
    document.querySelectorAll(
        ".control"
    );


controlButtons.forEach(
    function(button) {

        const key =
            button.dataset.key;


        /*
        TOUCH START
        */

        button.addEventListener(
            "touchstart",
            function(event) {

                event.preventDefault();

                keys[key] = true;

            },
            {
                passive: false
            }
        );


        /*
        TOUCH END
        */

        button.addEventListener(
            "touchend",
            function(event) {

                event.preventDefault();

                keys[key] = false;

            },
            {
                passive: false
            }
        );


        /*
        MOUSE
        */

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


/* =====================================================
   CEGAH SCROLL SAAT KONTROL GAME
   ===================================================== */

document.addEventListener(
    "touchmove",
    function(event) {

        if (gameRunning) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);
