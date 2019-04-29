var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var screenWidth = 500;

//
//
//Images
//
//

var playerImg = new Image(96, 153);
playerImg.src = 'images/player/player_default.png';

var slashImg = [];
slashImg[0] = new Image(96, 153);
slashImg[0].src = 'images/player/player_mid_slash.png';

slashImg[1] = new Image(144, 153);
slashImg[1].src = 'images/player/player_end_slash.png';

var fireStanceImg = new Image(112, 153);
fireStanceImg.src = 'images/player/player_fireball_stance.png'

var projImg = new Image(30, 30);
projImg.src = 'images/fireball.png';

var hGhostImg = new Image(60, 98);
hGhostImg.src = 'images/ghost2.png';

var background = new Image(500, 1950);
background.src = 'images/level.png';

var bossImg = new Image(428, 506);
bossImg.src = 'images/boss.png';

var aBossImg = new Image(428, 506);
aBossImg.src = 'images/attack_boss.png';

//Lists
var projList = [];
var hGhostList = [];
var bossList = [];
var eProjList = [];

//Level

var yBound = -2500;

var currentLevel = {
    x: 0,
    y: -2500,
    img: background
}

//Projectile class
class Projectile {
    constructor(x, y, dx, dy, damage, img, height, width) {
        this.x = x - width/2;
        this.y = y - height/2;
        this.img = img;
        this.dx = dx;
        this.dy = dy;
        this.damage = damage;
        this.height = height;
        this.width = width;
        this.speed = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.height, this.width)

    }
}

//
//
//Player object
//
//

var player = {
    health: 240,
    x: (canvas.width / 2) - 53,
    y: 450,
    img: playerImg,
    height: 153,
    width: 96,
    strength: 20,
    speed: 4,
    alive: true,
    currentWeapon: 0, //0 = sword, 1 ranged
    cHeight: 153,
    cWidth: 96,
    energy: 10,
    draw() {
        if(player.currentWeapon == 0) {
            ctx.drawImage(this.img, this.x, this.y, this.cWidth, this.cHeight)
        } else if(player.currentWeapon == 1){
            ctx.drawImage(this.img, this.x - 16, this.y, this.cWidth, this.cHeight)
        }
    },
    up: false,
    down: false,
    left: false,
    right: false,
    slashing: false,
    slashTimer: 0,
    shoot() {
        projList.push(new Projectile(player.x, player.y, 0, +10, 10, projImg, 20, 20));
    },
    damage(dmg) {
        this.health -= dmg;
    }
}

var slash = {
    x: player.x - 35,
    y: player.y - 60,
    width: 145,
    height: 95
}

var playerHitBox = {
    x: player.x,
    y: player.y + 73,
    width: 80,
    height: 80
}

//
//
//Enemy Classes
//
//

//Basic Ghost
class hoverGhost {
    constructor(x, y, speed) {
        this.health = 120
        this.x = x;
        this.y = y;
        this.img = hGhostImg;
        this.height = 98;
        this.width = 60;
        this.strength = 1;
        this.speed = speed;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    shoot() {
        eProjList.push(new Projectile(this.x, this.y, 0, +10, 10, projImg, 20, 20));
    }

    move() {
        if (this.x > 500 - this.width || this.x < 0) {
            this.speed = this.speed * -1;
        }
        this.x += this.speed;
    }

}

class boss {
    constructor(x, y) {
        this.health = 5000;
        this.x = x;
        this.y = y;
        this.img = bossImg;
        this.height = 506;
        this.width = 428;
        this.strength = 40;
        this.attackTimer = 75;
        this.touchDamage = .25;
        this.active = false;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

    singleShot() {
        eProjList.push(new Projectile(player.x, this.y-200 + this.height + 30, 0, -10, 25, projImg, 20, 20));
    }

    multiShot() {
        eProjList.push(new Projectile(400, this.y-100, Math.sqrt(5) * -1,-1 * Math.sqrt(5), 20, projImg, 20, 20));
        eProjList.push(new Projectile(400, this.y-100, Math.sqrt(5),-1 * Math.sqrt(5), 20, projImg, 20, 20));
        eProjList.push(new Projectile(400, this.y-100, 0, -10, 20, projImg, 20, 20));
    }

    megaShot() {
        eProjList.push(new Projectile(175, this.y-100, 0, -10, 40, projImg, 150, 150));
    }

    beam() {
        eProjList.push(new Projectile(player.x, this.y-100, 0, -10, 10, projImg, 15, 15));
        eProjList.push(new Projectile(player.x, this.y-100-7.5, 0, -10, 10, projImg, 15, 15));
        eProjList.push(new Projectile(player.x, this.y-100-15, 0, -10, 10, projImg, 15, 15));
        eProjList.push(new Projectile(player.x, this.y-100-22.5, 0, -10, 10, projImg, 15, 15));
        eProjList.push(new Projectile(player.x, this.y-100-30, 0, -10, 10, projImg, 15, 15));
        eProjList.push(new Projectile(player.x, this.y-100-37.5, 0, -10, 10, projImg, 15, 15));
    }


}

//
//
//Enemy Placement Generator
//
//

hGhostList[0] = new hoverGhost(200, 200, 5);
hGhostList[1] = new hoverGhost(100, 75, 6);
hGhostList[2] = new hoverGhost(300, -50, 3);
hGhostList[3] = new hoverGhost(400, -175, 7);
hGhostList[4] = new hoverGhost(200, -300, 4);
hGhostList[5] = new hoverGhost(150, -425, 8);
hGhostList[6] = new hoverGhost(150, -425, 4);
hGhostList[7] = new hoverGhost(150, -425, 6);
hGhostList[8] = new hoverGhost(225, -550, 6);
hGhostList[9] = new hoverGhost(225, -550, -6);
hGhostList[10] = new hoverGhost(335, -700, 3);
hGhostList[11] = new hoverGhost(150, -825, 4);
hGhostList[12] = new hoverGhost(150, -975, 8);
hGhostList[13] = new hoverGhost(150, -1100, 9);
hGhostList[14] = new hoverGhost(150, -1300, 6);




bossList[0] = new boss(36, -2000);




document.addEventListener("click", onClickHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function onClickHandler(e) {

    if (e.button == 0) {

        if (player.currentWeapon == 0) {

            if (player.slashTimer <= 0) {
                player.slashTimer = 28;
            }
        }

        if (player.currentWeapon == 1) {
            if(player.energy > 0) {
                player.shoot();
                player.energy--;
            }
        }
    }


}

//Key Press
function keyDownHandler(e) {
    //Movement
    if (e.key == "w") {
        player.up = true;
    }
    if (e.key == "s") {
        player.down = true;
    }
    if (e.key == "a") {
        player.left = true;
    }
    if (e.key == "d") {
        player.right = true;
    }

    if (e.key == "Shift") {

        if (player.currentWeapon == 1) {
            player.currentWeapon = 0;
            player.img = playerImg;
            player.cWidth = 96;
            
        } else if (player.currentWeapon == 0) {
            player.currentWeapon = 1;
            player.slashTimer = 0;
            player.img = fireStanceImg;
            player.cWidth = 112;
            
        }

    }

}
//Key Release
function keyUpHandler(e) {
    //Movement
    if (e.key == "w") {
        player.up = false;
    }
    if (e.key == "s") {
        player.down = false;
    }
    if (e.key == "a") {
        player.left = false;
    }
    if (e.key == "d") {
        player.right = false;
    }


}

function collide(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    }
    else {
        return false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentLevel.img, currentLevel.x, currentLevel.y);

    playerHitBox = {
        x: player.x,
        y: player.y + 53,
        width: 80,
        height: 100
    }

    if (bossList.length > 0) {
        
        if(bossList[0].health < 5000) {
            console.log("active")
            bossList[0].active = true;
        }
    }

    if (projList.length > 0) {
        for (let i = 0; i < projList.length; i++) {
            projList[i].x -= projList[i].dx;
            projList[i].y -= projList[i].dy;
            projList[i].draw()



            if (hGhostList.length > 0) {
                for (let j = 0; j < hGhostList.length; j++) {
                    if (collide(hGhostList[j], projList[i])) {

                        projList.splice(i, 1);
                        hGhostList[j].health -= player.strength * 8;
                        if (hGhostList[j].health <= 0) {
                            hGhostList.splice(j, 1);
                            if(player.energy < 10) {
                                player.energy++;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    if (projList.length > 0) {
        for (let i = 0; i < projList.length; i++) {
            if (bossList.length > 0) {
                for (let j = 0; j < bossList.length; j++) {
                    if (collide(bossList[j], projList[i])) {

                        projList.splice(i, 1);
                        bossList[j].health -= player.strength * 8;
                        if (bossList[j].health <= 0) {
                            bossList.splice(j, 1);
                        }
                        break;
                    }
                }
            }
        }
    }

    if (eProjList.length > 0) {
        for (let i = 0; i < eProjList.length; i++) {
            eProjList[i].x -= eProjList[i].dx;
            eProjList[i].y -= eProjList[i].dy;
            eProjList[i].draw()

            if (collide(playerHitBox, eProjList[i])) {

                
                player.health -= eProjList[i].damage;
                eProjList.splice(i, 1);
            }
        }
    }



    if (player.slashTimer > 0) {
        slash = {
            x: player.x,
            y: player.y - 5,
            width: 145,
            height: 95
        }
        player.slashing = true;
        if (player.slashTimer > 20) {
            player.img = slashImg[0]
        }
        if (player.slashTimer < 20 && player.slashTimer > 2) {
            player.img = slashImg[1];
            player.cWidth = 144;
        }
        if (player.slashTimer < 2) {
            player.img = playerImg;
            player.cWidth = player.width;
        }

        //ctx.fillStyle = "#FA5300";
        //ctx.fillRect(slash.x, slash.y, slash.width, slash.height);
        //ctx.fillStyle = "#0000FF";
        //ctx.fillRect(playerHitBox.x, playerHitBox.y, playerHitBox.width, playerHitBox.height);
        player.slashTimer -= 1;
    } else {
        player.slashing = false
    }



    if (hGhostList.length > 0) {
        for (let i = 0; i < hGhostList.length; i++) {
            hGhostList[i].move();
            hGhostList[i].draw();

            if (collide(hGhostList[i], playerHitBox)) {
                console.log(player.health);
                if (player.health > 0)
                    player.damage(hGhostList[i].strength);
            }
        }
    }

    if (bossList.length > 0) {
        for (let i = 0; i < bossList.length; i++) {
            bossList[i].draw();

            if (collide(bossList[i], playerHitBox)) {
                console.log(player.health);
                if (player.health > 0)
                    player.damage(bossList[i].touchDamage);
            }
        }
    }

    player.draw();

    ctx.fillStyle = "#990000";
    ctx.fillRect(25, player.y -400, player.health/2.4, 15);

    ctx.fillStyle = "#894AC0";
    ctx.fillRect(25, player.y -384, player.energy*10, 15);

    //
    //
    // Player Up
    //
    //
    if (player.up) {
        if (currentLevel.y < 0) {
            currentLevel.y += player.speed;

            if (currentLevel.y < -0) {
                if (hGhostList.length > 0) {
                    for (let i = 0; i < hGhostList.length; i++) {
                        hGhostList[i].y += player.speed;
                    }
                }

                if (bossList.length > 0) {
                    for (let i = 0; i < bossList.length; i++) {
                        bossList[i].y += player.speed;
                    }
                }
            }
        }
    }
    //
    //
    //Player Down
    //
    //
    if (player.down) {
        if (currentLevel.y > yBound) {
            currentLevel.y -= player.speed;

            if (currentLevel.y > yBound) {
                if (hGhostList.length > 0) {
                    for (let i = 0; i < hGhostList.length; i++) {
                        hGhostList[i].y -= player.speed;
                    }
                }

                if (bossList.length > 0) {
                    for (let i = 0; i < bossList.length; i++) {
                        bossList[i].y -= player.speed;
                    }
                }
            }
        }
    }
    if (player.left) {
        if (player.x > 32) {
            player.x -= player.speed;
        }
    }
    if (player.right) {
        if (player.x < 404) {
            player.x += player.speed;
        }
    }

    if (player.slashing == true) {


        for (let j = 0; j < hGhostList.length; j++) {

            if (collide(hGhostList[j], slash)) {

                hGhostList[j].health -= player.strength;
                if (hGhostList[j].health <= 0) {
                    hGhostList.splice(j, 1);
                    if(player.energy < 10) {
                        player.energy++;
                    }
                }
            }
        }

        for (let j = 0; j < bossList.length; j++) {

            if (collide(bossList[j], slash)) {

                bossList[j].health -= player.strength;
                if (bossList[j].health <= 0) {
                    bossList.splice(j, 1);
                }
            }
        }

    }

if(bossList.length > 0) {
    if(bossList[0].active == true) {
        if(bossList[0].attackTimer <= 0) {
            let attackDecider = Math.floor((Math.random() * 10) + 1);
            if(attackDecider >= 7) {
                bossList[0].singleShot();
            } else if(attackDecider >= 4) {
                bossList[0].multiShot();
            } else if(attackDecider >= 2) {
                bossList[0].megaShot();
            } else if(attackDecider >= 1) {
                bossList[0].beam();
            }
            bossList[0].attackTimer = 75;
            bossList[0].img = bossImg;
        } else {
            bossList[0].attackTimer = bossList[0].attackTimer - 1;
            if(bossList[0].attackTimer < 20) {
                bossList[0].img = aBossImg;
            }
        }
    }
}



    if (player.health <= 0) {
        console.log("dead");
        location.reload(true);
    }
}



setInterval(draw, 10)