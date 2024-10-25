
//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage,airplaneImage,bulletImage,enemyImage,gameOverImage;
let gameover=false; // true이면 게임이 끝남,false이면 게임이 안끝남
let score=0;

//우주선 좌표(계속 바뀌기 때문)
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-48;

let bulletList = [] //총알들을 저장하는 리스트
function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX
        this.y = spaceshipY
        this.alive=true  //true면 살아있는 총알 false면 죽은 총알

        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };
    this.chckHit = function () {
        for (let i = 0; i < enemyList.length; i++) { 
            if (this.alive && enemyList[i] && 
                this.y <= enemyList[i].y + 40 && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40) {
                //총알이 죽게됨 적군의 우주선이 없어짐,점수 획득
                score++;
                this.alive = false; //죽은 총알
                enemyList.splice(i, 1); 
            }
        }
     
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum;
}

let enemyList=[]
function Enemy(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-50); 
        enemyList.push(this);
    };
    this.update=function(){
        this.y +=3;  //적군 속도 조절

        if(this.y >= canvas.height-48){
            gameover = true;
            console.log("gameover");
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/space.jpg";

    airplaneImage = new Image();
    airplaneImage.src = "images/airplane.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/monster.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.jpg";

    fireImage = new Image();
    fireImage.src = "images/fire.png";
}

let keyDown={};
function setupkeyboardListener(){
    document.addEventListener("keydown",function(event){
        
        keyDown[event.keyCode] = true
        

    });
    document.addEventListener("keyup",function(){
        delete keyDown[event.keyCode];

        if(event.keyCode == 32){
            createBullet() // 총알 생성
        }
       
    });
}

function createBullet(){
   
    let b = new Bullet();
    b.init();

}

function createElement(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init()
    },1000); //호출하고 싶은 함수,시간(1초/1000)
}

function update(){
    if( 39 in keyDown){
        spaceshipX += 5;    //우주선의 속도
    }  //right
     if(37 in keyDown){
        spaceshipX -= 5;
     } //left

     //우주선의 좌표값 무제한 업데이트 안되게 하기 (경기장 안에만 있게)
     if(spaceshipX <= 0){
        spaceshipX=0
     }
     if(spaceshipX >= canvas.width-48){
        spaceshipX = canvas.width-48;
     }

     //총알의 y좌표 업데이트 함수
     for(let i=0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].chckHit();
        }
       
     }

     for(let i=0; i< enemyList.length; i++){
        enemyList[i].update();
     }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(airplaneImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`,20,20);score
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    
    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y); //총알발사
        }
        
    }

    for (let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
    if(!gameover){
        update(); //좌표값을 업데이트하고
        render(); //그려주고  
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage,10,100,380,380);
    }
   
}

loadImage();
setupkeyboardListener();
createElement();
main();

//방향키 누르면 우주선 좌표가 바뀌고 다시 render 그려준다

//총알 만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알이 y값이 --,총알의 x값은? 스페이스는 우주선의 x좌표
//3. 발사된 총알들은 총알 배열에 저장을 한다
//4. 총알들은 x,y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다

// 적군 만들기
// x,y ,init,update
//적군은 위치가 랜덤
//1초마다 적군이 하나씩 생성
//적군은 밑으로 내려온다 = y좌표가 증가한다.

//적군 죽는다
//총알이 적군에게 닿는다