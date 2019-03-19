var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Array Lists
var projList = [];
var ghostList = [];
var gProjList = []

//Counter for bullet management
var bulletCtr = 0;
var gBulletCtr = 0;
//Images
var calistaImg = new Image(64,102);
calistaImg.src = 'images/calista.png';

var projImg = new Image(30,30);
projImg.src = 'images/ball.png'

var ghostImg = new Image(128,128)
ghostImg.src = 'images/ghost.png'

//Character centering variable
const cx = 32
const cy = 51

const gcxy = 64




class Projectile {
    constructor(x,y,dx,dy,range,r, img) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.dx = dx;
        this.dy = dy;
        this.range = range;
        this.r = r;
    }

    draw() {
        ctx.drawImage(this.img, this.x-this.r,this.y-this.r,2*this.r,2*this.r)
            
    }
}

class Ghost {
    constructor() {
        this.health = 120
        this.x = 100
        this.y = 400
        this.img = ghostImg
        this.height = 128
        this.width = 128
        this.strength = 12
        this.speed = 8
        this.alive = true
        this.attackRange = 280    
        }

        draw() {
            ctx.drawImage(this.img, this.x-gcxy, this.y-gcxy, this.width, this.height)
        }

        shoot(dx, dy) {
            gProjList.push(new Projectile(this.x, this.y, dx, dy, this.attackRange, 15, projImg));
        }

}

ghostList[0] = new Ghost();

//Calista object
var calista = {
    health: 120,
    x: canvas.width/2,
    y: canvas.height/2,
    img: calistaImg,
    height: 102,
    width: 64,
    strength: 20,
    speed: 4,
    alive: true,
    attackRange: 520,
    draw() {
        ctx.drawImage(this.img, this.x-cx, this.y-cy, this.width, this.height)
    },
    up: false,
    down: false,
    left: false,
    right: false,
    shootUp: false,
    shootDown: false,
    shootLeft: false,
    shootRight: false,
    shoot(dx, dy) {
        projList.push(new Projectile(calista.x, calista.y, dx, dy, calista.attackRange, 10, projImg));
    }
}
calista.health += 15


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    //Movement
    if(e.keyCode == 87) {
        calista.up = true;
    }
    if(e.keyCode == 83) {
        calista.down = true;
    }
    if(e.keyCode == 65) {
        calista.left = true;
    }
    if(e.keyCode == 68) {
        calista.right = true;
    }

    //Shooting
    if(e.keyCode == 38) {
        calista.shootUp = true;
    }
    if(e.keyCode == 40) {
        calista.shootDown = true;
    }
    if(e.keyCode == 37) {
        calista.shootLeft = true;
    }
    if(e.keyCode == 39) {
        calista.shootRight = true;
    }
}

function keyUpHandler(e) {
    //Movement
    if(e.keyCode == 87) {
        calista.up = false;
    }
    if(e.keyCode == 83) {
        calista.down = false;
    }
    if(e.keyCode == 65) {
        calista.left = false;
    }
    if(e.keyCode == 68) {
        calista.right = false;
    }

    //Shooting
    if(e.keyCode == 38) {
        calista.shootUp = false;
        bulletCtr = 15;
    }
    if(e.keyCode == 40) {
        calista.shootDown = false;
        bulletCtr = 15;
    }
    if(e.keyCode == 37) {
        calista.shootLeft = false;
        bulletCtr = 15;
    }
    if(e.keyCode == 39) {
        calista.shootRight = false;
        bulletCtr = 15;
    }
}

function collide(obj1, obj2) {
    let a = false;
    let b = false;
    if(obj1.x + gcxy/2 - 3 >= obj2.x && obj1.x - gcxy/2 + 3 <= obj2.x) {
        a = true;
        
    }

    if(obj1.y + gcxy/2 - 3 >= obj2.y && obj1.y - gcxy/2 + 3 <= obj2.y) {
        b = true;
        
    }

    if(a && b) {
        
        return true

    } else {
        return false
    }
}
 
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    calista.draw();
    if(ghostList.length > 0) {
        ghostList[0].draw();
    }

    //Draw and move bullets
    if(projList.length > 0) {
        for(let i = 0; i < projList.length; i++) {
            projList[i].draw()
            //ctx.drawImage(projImg, projList[i].x-10,projList[i].y-10,20,20)
            projList[i].x -= projList[i].dx;
            projList[i].y -= projList[i].dy;
            
        }
    }
    
    //Move calista
    if(calista.up == true) {
        calista.y -= calista.speed
    }
    if(calista.down == true) {
        calista.y += calista.speed
    }
    if(calista.left == true) {
        calista.x -= calista.speed
    }
    if(calista.right == true) {
        calista.x += calista.speed
    }

    //Control bullet shooting speed
    if(bulletCtr >= 15) {
        if(calista.shootUp == true) {
            calista.shoot(0,5);
            bulletCtr = 0
        }
        else if(calista.shootDown == true) {
            calista.shoot(0,-5);
            bulletCtr = 0
        }
        else if(calista.shootLeft == true) {
            calista.shoot(5,0);
            bulletCtr = 0
        }
        else if(calista.shootRight == true) {
            calista.shoot(-5,0);
            bulletCtr = 0
        }
        
    }
    bulletCtr++;

    if(gBulletCtr >= 120) {
        if(ghostList.length > 0) {
            for(let j = 0; j < ghostList.length; j++) {
                ghostList[j].shoot(0,3)
                ghostList[j].shoot(0,-3)
                ghostList[j].shoot(3,0)
                ghostList[j].shoot(-3,0)
            }
        }
        gBulletCtr = 0;
    }
    gBulletCtr++;
    
    //Move the ghost bullets    
    if(gProjList.length > 0) {
        for(let i = 0; i < gProjList.length; i++) {
            gProjList[i].draw();
            gProjList[i].x -= gProjList[i].dx;
            gProjList[i].y -= gProjList[i].dy;        
        }
    }
    
    
    //Move ghost towards player
    if(ghostList.length > 0) {
        for(let j = 0; j < ghostList.length; j++) {
            if(ghostList[j].x < calista.x+2*cx) 
                ghostList[j].x++;
            if(ghostList[j].x > calista.x-2*cx)
                ghostList[j].x--;
            if(ghostList[j].y < calista.y-2*cy)
                ghostList[j].y++;
            if(ghostList[j].y > calista.y+2*cy)
                ghostList[j].y--;
        }
    }

    //Attack player with ghost
    if(gProjList.length > 0) {
        
        for(let i = 0; i < gProjList.length; i++) {
            
            if(collide(calista, gProjList[i])) {
                gProjList.splice(i,1);                    
                calista.health -= 10;    
            }
            
        }
    }

    //Collision detection 
    if(projList.length > 0) {
        
        for(let i = 0; i < projList.length; i++) {
            for(let j = 0; j < ghostList.length; j++) {

                if(collide(ghostList[j], projList[i])) {
                    projList.splice(i,1);
                    ghostList[j].health -= calista.strength;
                    if(ghostList[j].health <= 0) {
                        ghostList.splice(j,1);
                    }
                }
            }
        }
    }
}

setInterval(draw, 10)