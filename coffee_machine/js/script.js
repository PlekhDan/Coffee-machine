let money = document.getElementById("money");
    let display = document.getElementById("display");
    let displayInfo = document.getElementById("displayInfo");
    let displayBalance = document.getElementById("displayBalance");
    let bill_acc = document.getElementById("bill_acc");
    let progressBar = document.getElementsByClassName("progress-bar")[0];
    let giveMoneyBox = document.getElementById("giveMoneyBox");
    let buttons = document.getElementsByClassName("button");
    
    function audioClick() {
        let audioClick = new Audio("audio/audioClick.mp3");
        audioClick.play();
    }
    
    function changeButtonPointerEvents(type) {
        let buttons = document.getElementsByClassName("button");
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            button.style.pointerEvents = type;
        }
    }
                
    function getCoffee(coffeeName, price) {
        if(+money.value >= +price) {
            money.value = +money.value - price;
            displayBalance.textContent = `Баланс: ${money.value} ₽`;
            changeButtonPointerEvents("none");
            let progress = 0;
            let timerId = setInterval(() => {
                progressBar.hidden = false;
                progressBar.style.width = ++progress + "%";
                let audioGetCoffee = new Audio("audio/audioGetCoffee.mp3");
                if (progress < 40) {
                    audioGetCoffee.play();
                    displayInfo.innerHTML = `<i class="fas fa-hourglass-start fa-2x"></i>`;
                } else if (progress < 80) {
                    audioGetCoffee.play();
                    displayInfo.innerHTML = `<i class="fas fa-hourglass-half fa-2x"></i>`;
                } else if (progress < 100) {
                    audioGetCoffee.play();
                    displayInfo.innerHTML = `<i class="fas fa-hourglass-end fa-2x"></i>`;
                } else if (progress > 120) {
                    clearInterval(timerId);
                    progressBar.hidden = true;
                    progressBar.style.width = 0 + "%";
                    //displayInfo.textContent = `Кофе ${coffeeName} готов`;
                    displayInfo.innerHTML = `Кофе ${coffeeName} готов <br\><br\> <i class="fas fa-coffee fa-2x"></i>`;
                    let audioCoffeeDone = new Audio("audio/audioCoffeeDone.mp3");
                    audioCoffeeDone.play();
                    changeButtonPointerEvents("auto");
                }
            } , 70);
        } else {
            displayInfo.innerHTML = `Недостаточно средств <br\><br\> <i class="far fa-frown fa-2x"></i>`;
            let audioErrore = new Audio("audio/audioErrore.mp3");
            audioErrore.play();
            /*displayInfo.textContent = "Недостаточно средств"; */
        }
    }

    function moneyDelivery(sum) {
        let giveMoneyBox_h = giveMoneyBox.getBoundingClientRect().height - 60;
        let giveMoneyBox_w = giveMoneyBox.getBoundingClientRect().width - 60;
        while (sum != 0) {
            let nominal;
            if (sum >= 10) {
                sum = sum - 10;
                nominal = 10;
            } else if (sum >= 5) {
                sum = sum - 5;
                nominal = 5;
            } else if (sum >= 2) {
                sum = sum - 2;
                nominal = 2;
            } else {
                sum = sum - 1;
                nominal = 1;
            }
            let audioMoneyDelivery = new Audio("audio/audioMoneyDelivery.mp3");
            audioMoneyDelivery.play();
            let img = document.createElement("img");
            img.src = `img/${nominal}rub.png`;
            let top = Math.random() * giveMoneyBox_h;
            let left = Math.random() * giveMoneyBox_w;
            img.style.top = top + "px";
            img.style.left = left + "px";
            giveMoneyBox.append(img);
            money.value = 0;
            displayBalance.textContent = `Баланс: ${money.value} ₽`;
            img.onclick = function() {
                this.hidden = true;
            }
        }
    }


    let banknotes = document.querySelectorAll("[src $= 'rub.jpg']");
    for (let i = 0; i < banknotes.length; i++) {
        let banknote = banknotes[i];
        banknote.onmousedown = function (e) {
            banknote.ondragstart = function () {
                return false;
            }
            this.style.position = "absolute";
            this.style.zIndex = 22;
            this.style.transform = "rotate(90deg)";
            moveAt(e);
            function moveAt(event) {
                banknote.style.top = (event.clientY - banknote.offsetHeight / 2) + "px";
                banknote.style.left = (event.clientX - banknote.offsetWidth / 2) + "px";
            }
            document.addEventListener("mousemove", moveAt);
            banknote.onmouseup = function () {
                document.removeEventListener("mousemove", moveAt);
                this.style.zIndex = 20;
                let bill_acc_top = bill_acc.getBoundingClientRect().top; // Верх купюроприемника
                //let bill_acc_bottom = bill_acc.offsetHeight * 2 / 3;
                let bill_acc_bottom = bill_acc.getBoundingClientRect().bottom - (bill_acc.getBoundingClientRect().height * 2 / 3);
                let bill_acc_left = bill_acc.getBoundingClientRect().left;
                let bill_acc_right = bill_acc.getBoundingClientRect().right;
                let banknote_top = this.getBoundingClientRect().top; // Верх купюры
                let banknote_left = this.getBoundingClientRect().left;
                let banknote_right = this.getBoundingClientRect().right;
                // Чтобы купюра пропадала в определенной области
                if (bill_acc_top < banknote_top && bill_acc_bottom > banknote_top && bill_acc_left < banknote_left && bill_acc_right > banknote_right) { 
                    money.value = (+money.value) + (+this.dataset.value);
                    this.hidden = true; // Скрытие элемента при помощи свойства hidden
                    displayBalance.textContent = `Баланс: ${money.value} ₽`;
                }
            }
        }
    }