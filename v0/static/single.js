let myApp = new Vue({
    el: "#myApp",
    delimiters: ["[[", "]]"],
    data: {
        names: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        },
        isChecked: {
            0: 0,
            1: 0,
            2: 0,
        },
        num: {
            0: -1,
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1
        }
    },
    methods: {
        searchName: function (e) {
            axios.get('/pokemon/name/search',
                {params: {value: e.target.value}})
                .then(response => {
                    console.log(e)
                    this.names[parseInt(e.target.getAttribute("index")) - 1] = response.data.names
                    let v = e.target.getBoundingClientRect()
                    this.$refs["myPokelistValue" + e.target.getAttribute("index")][0].style = `top: ${v.x + v.height}; left: ${v.x}px;width: ${v.width}px;`
                })
        },
        clickSelf: function (i, name) {
            document.getElementById("myPokelist" + i).value = name;
            this.names[i - 1] = [];
            axios.get('/pokemon/stats/search',
                {params: {value: name}})
                .then(response => {
                    this.num[i - 1] = JSON.parse(response.data).No;
                })
        },
        clickNow: function (i) {
            let name = document.getElementById("myPokelist" + i).value
            document.getElementById("myPokeNow").value = name;
            axios.get('/pokemon/stats/search',
                {params: {value: name}})
                .then(response => {
                    myInfo.basePrams[i] = JSON.parse(response.data);
                    document.getElementById("base_HP").value = myInfo.basePrams[i].hp;
                    document.getElementById("base_ATK").value = myInfo.basePrams[i].attack;
                    document.getElementById("base_DF").value = myInfo.basePrams[i].defence;
                    document.getElementById("base_SPATK").value = myInfo.basePrams[i].sp_attack;
                    document.getElementById("base_SPDF").value = myInfo.basePrams[i].sp_defence;
                    document.getElementById("base_SP").value = myInfo.basePrams[i].speed;
                    document.getElementById("myPokeItem").value = myInfo.uniquePrams[i].item;
                    document.getElementById("myPokeAbi").value = myInfo.uniquePrams[i].ability;
                    document.getElementById("myPokeChar").value = myInfo.uniquePrams[i].character;
                    document.getElementById("EV_HP").value = myInfo.uniquePrams[i].EV.hp;
                    document.getElementById("EV_ATK").value = myInfo.uniquePrams[i].EV.attack;
                    document.getElementById("EV_DF").value = myInfo.uniquePrams[i].EV.defence;
                    document.getElementById("EV_SPATK").value = myInfo.uniquePrams[i].EV.sp_attack;
                    document.getElementById("EV_SPDF").value = myInfo.uniquePrams[i].EV.sp_defence;
                    document.getElementById("EV_SP").value = myInfo.uniquePrams[i].EV.speed;
                    document.getElementById("myPokeWeapon1").value = myInfo.uniquePrams[i].weapon1;
                    document.getElementById("myPokeWeapon2").value = myInfo.uniquePrams[i].weapon2;
                    document.getElementById("myPokeWeapon3").value = myInfo.uniquePrams[i].weapon3;
                    document.getElementById("myPokeWeapon4").value = myInfo.uniquePrams[i].weapon4;
                    myInfo.nowNum = i
                })
        },
        search_No: function (i) {
            return myInfo.basePrams[i].No
        },
        removeSameRadio: function (e) {
            let current;
            switch (e.target.name) {
                case 'myFirst':
                    current = 0;
                    break;
                case 'mySecond':
                    current = 1;
                    break;
                case 'myThird':
                    current = 2;
                    break;
                default:
                    current = -1;
            }
            if (current !== -1) {
                this.isChecked[current] = e.target.value;
                if (this.isChecked[current] === this.isChecked[(current + 1) % 3]) {
                    let elem = document.getElementById('myRadio' + e.target.value + "-" + ((current + 1) % 3 + 1));
                    elem.checked = false;
                }
                if (this.isChecked[current] === this.isChecked[(current + 2) % 3]) {
                    let elem = document.getElementById('myRadio' + e.target.value + "-" + ((current + 2) % 3 + 1));
                    elem.checked = false;
                }
            }
        }, focusOut: function (i) {
            const app = this;
            setTimeout(function () {
                app.names[i - 1] = []
            }, 200)
        }
    },
    computed: {
        myPokeImg: function () {
            return function (i) {
                if ((this.num[i - 1] > 0) && (!isNaN(this.num[i - 1])))
                    return ('https://nouthuca.com/img/swsf/icon/' + this.num[i - 1] + '.png')
                else
                    return ('https://nouthuca.com/img/swsf/icon/noimg.png')
            }
        }
    }
})

let rivalApp = new Vue({
    el: "#rivalApp",
    delimiters: ["[[", "]]"],
    data: {
        names: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        },
        isChecked: {
            0: 0,
            1: 0,
            2: 0,
        },
        num: {
            0: -1,
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1
        }
    },
    methods: {
        searchName: function (e) {
            axios.get('/pokemon/name/search',
                {params: {value: e.target.value}})
                .then(response => {
                    console.log(e)
                    this.names[parseInt(e.target.getAttribute("index")) - 1] = response.data.names
                    let v = e.target.getBoundingClientRect()
                    this.$refs["rivalPokelistValue" + e.target.getAttribute("index")][0].style = `top: ${v.x + v.height}; left: ${v.x}px;width: ${v.width}px;`
                })
        }
        ,
        clickSelf: function (i, name) {
            document.getElementById("rivalPokelist" + i).value = name
            this.names[i - 1] = []
            axios.get('/pokemon/stats/search',
                {params: {value: name}})
                .then(response => {
                    this.num[i - 1] = JSON.parse(response.data).No;
                })
        }
        ,
        clickNow: function (i) {
            let name = document.getElementById("rivalPokelist" + i).value
            document.getElementById("rivalPokeNow").value = name;
            axios.get('/pokemon/stats/search',
                {params: {value: name}})
                .then(response => {
                    rivalInfo.basePrams[i] = JSON.parse(response.data);
                    document.getElementById("rivalPokeItem").value = rivalInfo.uniquePrams[i].item;
                    document.getElementById("rivalPokeAbi").value = rivalInfo.uniquePrams[i].ability;
                    document.getElementById("rivalPokeChar").value = rivalInfo.uniquePrams[i].character;
                    document.getElementById("rivalPokeWeapon1").value = rivalInfo.uniquePrams[i].weapon1;
                    document.getElementById("rivalPokeWeapon2").value = rivalInfo.uniquePrams[i].weapon2;
                    document.getElementById("rivalPokeWeapon3").value = rivalInfo.uniquePrams[i].weapon3;
                    document.getElementById("rivalPokeWeapon4").value = rivalInfo.uniquePrams[i].weapon4;
                    rivalInfo.nowNum = i
                })
        }
        ,
        removeSameRadio: function (e) {
            let current;
            switch (e.target.name) {
                case 'rivalFirst':
                    current = 0;
                    break;
                case 'rivalSecond':
                    current = 1;
                    break;
                case 'rivalThird':
                    current = 2;
                    break;
                default:
                    current = -1;
            }
            if (current !== -1) {
                this.isChecked[current] = e.target.value;
                if (this.isChecked[current] === this.isChecked[(current + 1) % 3]) {
                    let elem = document.getElementById('rivalRadio' + e.target.value + "-" + ((current + 1) % 3 + 1));
                    elem.checked = false;
                }
                if (this.isChecked[current] === this.isChecked[(current + 2) % 3]) {
                    let elem = document.getElementById('rivalRadio' + e.target.value + "-" + ((current + 2) % 3 + 1));
                    elem.checked = false;
                }
            }
        }
        ,
        focusOut: function (i) {
            const app = this;
            setTimeout(function () {
                app.names[i - 1] = []
            }, 200)
        }
    }
    ,
    computed: {
        rivalPokeImg: function () {
            return function (i) {
                if ((this.num[i - 1] > 0) && (!isNaN(this.num[i - 1])))
                    return ('https://nouthuca.com/img/swsf/icon/' + this.num[i - 1] + '.png')
                else
                    return ('https://nouthuca.com/img/swsf/icon/noimg.png')
            }
        }
    }
})

let myInfo = new Vue({
    el: "#myInfo",
    delimiters: ["[[", "]]"],
    data: {
        nowNum: -1,
        statsType: ["HP", "ATK", "DF", "SPATK", "SPDF", "SP"],
        items: [],
        basePrams: {
            // id, No, name, types, abilities, moves, hp, attack, defence, sp_attack, sp_defence, speed
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        },
        uniquePrams: {
            // name, item, ability, move, hp, attack, defence, sp_attack, sp_defence, speed
            0: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            1: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            2: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            3: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            4: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            5: {
                name: "",
                item: "",
                ability: "",
                IV: {
                    hp: 31, attack: 31, defence: 31, sp_attack: 31, sp_defence: 31, speed: 31
                },
                EV: {
                    hp: 0, attack: 0, defence: 0, sp_attack: 0, sp_defence: 0, speed: 0
                },
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
        }
    }, methods: {
        searchItemName: function (e) {
            axios.get('/item/name/search',
                {params: {value: e.target.value}})
                .then(response => {
                    console.log(e)
                    this.items = response.data.items
                    let v = e.target.getBoundingClientRect()
                    this.$refs["myPokeItemValue"].style = `top: ${v.x + v.height}; left: ${v.x}px;width: ${v.width}px;`
                })
        },
        clickSelf: function (name) {
            document.getElementById("myPokeItem").value = name
            this.uniquePrams[this.nowNum].item = name
            this.items = []
        },
        focusOut: function (i) {
            const app = this;
            setTimeout(function () {
                app.items = []
            }, 200)
        },
        changeItem: function () {
            this.uniquePrams[this.nowNum].item = document.getElementById("myPokeItem").value
        },
        changeAbi: function () {
            this.uniquePrams[this.nowNum].ability = document.getElementById("myPokeAbi").value
        },
        changeChar: function () {
            this.uniquePrams[this.nowNum].character = document.getElementById("myPokeChar").value
        },
        changeEV: function (stats) {
            switch (stats) {
                case "HP":
                    this.uniquePrams[this.nowNum].EV.hp = document.getElementById("EV_HP").value
                    break
                case "ATK":
                    this.uniquePrams[this.nowNum].EV.attack = document.getElementById("EV_ATK").value
                    break
                case "DF":
                    this.uniquePrams[this.nowNum].EV.defence = document.getElementById("EV_DF").value
                    break
                case "SPATK":
                    this.uniquePrams[this.nowNum].EV.sp_attack = document.getElementById("EV_SPATK").value
                    break
                case "SPDF":
                    this.uniquePrams[this.nowNum].EV.sp_defence = document.getElementById("EV_SPDF").value
                    break
                case "SP":
                    this.uniquePrams[this.nowNum].EV.speed = document.getElementById("EV_SP").value
                    break
            }
        },
        changeIV: function (stats) {
            switch (stats) {
                case "HP":
                    this.uniquePrams[this.nowNum].IV.hp = document.getElementById("IV_HP").value
                    break
                case "ATK":
                    this.uniquePrams[this.nowNum].IV.attack = document.getElementById("IV_ATK").value
                    break
                case "DF":
                    this.uniquePrams[this.nowNum].IV.defence = document.getElementById("IV_DF").value
                    break
                case "SPATK":
                    this.uniquePrams[this.nowNum].IV.sp_attack = document.getElementById("IV_SPATK").value
                    break
                case "SPDF":
                    this.uniquePrams[this.nowNum].IV.sp_defence = document.getElementById("IV_SPDF").value
                    break
                case "SP":
                    this.uniquePrams[this.nowNum].IV.speed = document.getElementById("IV_SP").value
                    break
            }
        },
        changeWeapon: function () {
            this.uniquePrams[this.nowNum].weapon1 = document.getElementById("myPokeWeapon1").value
            this.uniquePrams[this.nowNum].weapon2 = document.getElementById("myPokeWeapon2").value
            this.uniquePrams[this.nowNum].weapon3 = document.getElementById("myPokeWeapon3").value
            this.uniquePrams[this.nowNum].weapon4 = document.getElementById("myPokeWeapon4").value
        }
    },
    computed: {
        myPokeImg: function () {
            console.log("画像")
            if ((this.nowNum > 0) && (!isNaN(this.basePrams[this.nowNum].No)))
                return ('https://nouthuca.com/img/swsf/icon/' + this.basePrams[this.nowNum].No + '.png')
            else
                return ('https://nouthuca.com/img/swsf/icon/noimg.png')
        },
        realNumber: function () {
            return function (stats) {
                if (this.nowNum < 0)
                    return null
                else if (stats === "HP")
                    return (Math.floor(parseInt(document.getElementById("base_" + stats).value)
                        + parseInt(document.getElementById("EV_" + stats).value) / 8 + parseInt(document.getElementById("IV_" + stats).value) / 2) + 60)
                else
                    return (Math.floor(Math.floor(parseInt(document.getElementById("base_" + stats).value)
                        + parseInt(document.getElementById("EV_" + stats).value) / 8 + parseInt(document.getElementById("IV_" + stats).value) / 2) + 5))
            }
        },
        abiList: function () {
            if (this.nowNum < 0)
                return null
            else
                return this.basePrams[this.nowNum].abilities.split(',')
        }
    }
})

let rivalInfo = new Vue({
    el: "#rivalInfo",
    delimiters: ["[[", "]]"],
    data: {
        TN: "",
        rank: "",
        nowNum: -1,
        items: [],
        basePrams: {
            // id, No, name, types, abilities, moves, hp, attack, defence, sp_attack, sp_defence, speed
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        },
        uniquePrams: {
            // name, item, ability, move, hp, attack, defence, sp_attack, sp_defence, speed
            0: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            1: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            2: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            3: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            4: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
            5: {
                name: "",
                item: "",
                ability: "",
                character: "",
                weapon1: "",
                weapon2: "",
                weapon3: "",
                weapon4: ""
            },
        }
    }, methods: {
        searchName: function (e) {
            axios.get('/item/name/search',
                {params: {value: e.target.value}})
                .then(response => {
                    console.log(e)
                    this.items = response.data.items
                    let v = e.target.getBoundingClientRect()
                    this.$refs["rivalPokeItemValue"].style = `top: ${v.x + v.height}; left: ${v.x}px;width: ${v.width}px;`
                })
        },
        clickSelf: function (name) {
            document.getElementById("rivalPokeItem").value = name
            this.uniquePrams[this.nowNum].item = name
            this.items = []
        },
        focusOut: function (i) {
            const app = this;
            setTimeout(function () {
                app.items = []
            }, 200)
        },
        changeItem: function () {
            this.uniquePrams[this.nowNum].item = document.getElementById("rivalPokeItem").value
        },
        changeAbi: function () {
            this.uniquePrams[this.nowNum].ability = document.getElementById("rivalPokeAbi").value
        },
        changeChar: function () {
            this.uniquePrams[this.nowNum].character = document.getElementById("rivalPokeChar").value
        },
        changeWeapon: function () {
            this.uniquePrams[this.nowNum].weapon1 = document.getElementById("rivalPokeWeapon1").value
            this.uniquePrams[this.nowNum].weapon2 = document.getElementById("rivalPokeWeapon2").value
            this.uniquePrams[this.nowNum].weapon3 = document.getElementById("rivalPokeWeapon3").value
            this.uniquePrams[this.nowNum].weapon4 = document.getElementById("rivalPokeWeapon4").value
        }
    },
    computed: {
        rivalPokeImg: function () {
            console.log("画像")
            if ((this.nowNum > 0) && (!isNaN(this.basePrams[this.nowNum].No)))
                return ('https://nouthuca.com/img/swsf/icon/' + this.basePrams[this.nowNum].No + '.png')
            else
                return ('https://nouthuca.com/img/swsf/icon/noimg.png')
        },
        abiList: function () {
            if (this.nowNum < 0)
                return null
            else
                return this.basePrams[this.nowNum].abilities.split(',')
        }
    }
})
