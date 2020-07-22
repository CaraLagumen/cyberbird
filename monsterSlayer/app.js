new Vue({
  el: "#app",
  data: {
    playerHP: 100,
    monsterHP: 100,
    isGameOver: true,
    turns: [],
  },
  methods: {
    onStartGame: function () {
      this.isGameOver = false;
      this.playerHP = 100;
      this.monsterHP = 100;
    },
    onAttack: function () {
      var damage = this.calcDmg(4, 10);
      this.monsterHP -= damage;

      this.turns.unshift({
        isPlayer: true,
        text: "Player hits monster for " + damage,
      });

      this.monsterAttack();
      this.checkWin();
    },
    onSpecialAttack: function () {
      var damage = this.calcDmg(8, 10);
      this.monsterHP -= damage;

      this.turns.unshift({
        isPlayer: true,
        text: "Player hits monster for " + damage,
      });

      this.monsterAttack();
      this.checkWin();
    },
    onHeal: function () {
      if (this.playerHP + 10 >= 100) {
        this.turns.unshift({
          isPlayer: true,
          text: "Player heals for " + (100 - this.playerHP),
        });

        this.playerHP = 100;
        this.monsterAttack();
        return;
      }
      this.playerHP += 10;

      this.turns.unshift({
        isPlayer: true,
        text: "Player heals for 10",
      });

      this.monsterAttack();
    },
    onGiveUp: function () {
      this.isGameOver = true;
      return alert("You lost!");
    },
    calcDmg: function (min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    checkWin: function () {
      if (this.monsterHP <= 0) {
        this.isGameOver = true;
        return alert("You won!");
      }

      if (this.playerHP <= 0) {
        this.isGameOver = true;
        return alert("You lost!");
      }
    },
    monsterAttack: function () {
      var damage = this.calcDmg(5, 12);
      this.playerHP -= damage;

      this.turns.unshift({
        isPlayer: false,
        text: "Monster hits monster for " + damage,
      });
    },
  },
});
