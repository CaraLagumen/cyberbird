//FUNCTION CONSTRUCTOR
/*
var cara = {
    name: 'Cara',
    yearOfBirth: 1991,
    job: 'barista'
};

var Person = function(name, yearOfBirth, job) {
    this.name = name;
    this.yearOfBirth = yearOfBirth;
    this.job = job;
}

Person.prototype.calculateAge = function() {
    console.log(2019 - this.yearOfBirth);
}

Person.prototype.lastName = 'Berney';

var john = new Person('John', 2006, 'student');
var pheobe = new Person('Pheobe', 2008, 'student');
var catherine = new Person('Catherine', 1966, 'actress');

john.calculateAge();
pheobe.calculateAge();
catherine.calculateAge();

console.log(john.lastName, pheobe.lastName, catherine.lastName);
*/

//OBJECT.CREATE
/*
var personProto = {
    calculateAge: function() {
        console.log(2019 - this.yearOfBirth);
    }
}

var john = Object.create(personProto);
john.name = 'John';
john.yearOfBirth = 2006;
john.job = 'student';

var pheobe = Object.create(personProto,
{
    name: { value: 'Pheobe' },
    yearOfBirth: { value: 2008 },
    job: { value: 'student' }
})
*/

//PRIMITIVES VS OBJECTS
//PRIMITIVES
/*
var a = 23;
var b = a;
a = 46;
console.log(a, b);

//OBJECTS
var obj1 = {
    name: 'John',
    age: 12
}
var obj2 = obj1;
obj1.age = 30;
console.log(obj1.age, obj2.age);
var age = 8;
var obj = {
    name: 'Pheobe',
    city: 'Henderson'
}

//FUNCTIONS
function change(a, b) {
    a = 30;
    b.city = 'San Francisco';
}
change(age, obj);
console.log(age, obj.city);
*/

//PASSING FUNCTIONS AS ARGUMENTS
/*
var years = [1991, 2008, 2006, 1966];

function arrayCalc(arr, fn) {
    var arrRes = [];
    for (var i = 0; i < arr.length; i++) {
        arrRes.push(fn(arr[i]));
    }
    return arrRes;
}

function calculateAge(elem) {
    return 2019 - elem;
}

function isFullAge(elem) {
    return elem >= 18;
}

function maxHeartRate(elem) {
    if (elem >= 18 && elem <= 81) {
        return Math.round(206.9 - (0.67 * elem));
    } else {
        return -1;
    }
}

var ages = arrayCalc(years, calculateAge);
var fullAges = arrayCalc(ages, isFullAge);
var rates = arrayCalc(ages, maxHeartRate);
*/

//FUNCTIONS RETURNING FUNCTIONS
/*
function interviewQuestion(job) {
    if (job === 'developer') {
        return function(name) {
            console.log(name + ', can you please explain what UX design is?');
        }
    } else if (job === 'teacher') {
        return function(name) {
            console.log('What subject do you teach, ' + name + '?');
        }
    } else {
        return function(name) {
            console.log('Hello ' + name + ', what do you do?');
        }
    }
}

var teacherQuestion = interviewQuestion('teacher');
teacherQuestion('John');
interviewQuestion('Uber Driver')('Catherine');
*/

//IIFE
/*
function game() {
    var score = Math.random() * 10;
    console.log(score >= 5);
}
game();

(function () {
    var score = Math.random() * 10;
    console.log(score >= 5);
})();

(function (goodLuck) {
    var score = Math.random() * 10;
    console.log(score >= 5 - goodLuck);
})(5);
*/

//CLOSURES
/*
function retirement(retirementAge) {
    var a = ' years left until retirement.';
    return function(yearOfBirth) {
        var age = 2019 - yearOfBirth;
        console.log((retirementAge - age) + a);
    }
}

var retirementUS = retirement(66);
retirementUS(1991);
retirement(66)(1991);

var retirementGermany = retirement(65);
var retirementIceland = retirement(67);
retirementGermany(1991);
retirementIceland(1991);
*/

//CHALLENGE
/*
function interviewQuestion(name) {
    var x = 'Hello ';
    var y = ', what do you do?';
    return function(job) {
        console.log(x + name + y);
    }
}

interviewQuestion('Cara')('barista');
*/

//BIND, CALL, APPLY
/*
var cara = {
    name: 'Cara',
    age: 27,
    job: 'barista',
    presentation: function(style, timeOfDay) {
        if (style === 'formal') {
            console.log('Good ' + timeOfDay + ', ladies and gentlemen! I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old.');
        } else if (style === 'friendly') {
            console.log('Hey! What\'s up? I\'m ' + this.name + ', I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old. Have a nice ' + timeOfDay + '.');
        }
    }
}

var catherine = {
    name: 'Catherine',
    age: 52,
    job: 'driver'
}

cara.presentation('formal', 'morning');
//CALL
cara.presentation.call(catherine, 'friendly', 'afternoon');
//APPLY - WORKS FOR ARRAYS
cara.presentation.apply(catherine, ['friendly', 'afternoon']);
//BIND - CREATES COPY
var caraFriendly = cara.presentation.bind(cara, 'friendly');
caraFriendly('morning');
var catherineInformal = cara.presentation.bind(catherine, 'formal');
catherineInformal('afternoon');

var years = [1991, 2008, 2006, 1966];

function arrayCalc(arr, fn) {
    var arrRes = [];
    for (var i = 0; i < arr.length; i++) {
        arrRes.push(fn(arr[i]));
    }
    return arrRes;
}

function calculateAge(elem) {
    return 2019 - elem;
}

function isFullAge(limit, elem) {
    return elem >= limit;
}

var ages = arrayCalc(years, calculateAge);
var fullJapan = arrayCalc(ages, isFullAge.bind(this, 20));
console.log(ages, fullJapan);
*/

//CODING CHALLENGE

/*(function() {
    var question, correctAnswer;
    var score = 0;
    function questions() {
        var randomizer = Math.floor(Math.random() * 3);
        if (randomizer === 1) {
            question = 'Who is my favorite Avatar: The Last Airbender character?';
            console.log('A = Zuko');
            console.log('B = Toph');
            console.log('C = Azula');
            correctAnswer = 'C';
        } else if (randomizer === 2) {
            question = 'Where was I born?';
            console.log('A = Philippines');
            console.log('B = Korea');
            console.log('C = Malaysia');
            correctAnswer = 'A';
        } else if (randomizer === 0) {
            question = 'Which world do I think would be fascinating to live in?';
            console.log('A = Game of Thrones');
            console.log('B = Ghost in the Shell');
            console.log('C = Star Wars');
            correctAnswer = 'C';
        }
    }
    while (prompt(question) !== 'exit') {
        if (prompt(question) === correctAnswer) {
            score++;
        }
        console.log('Score: ' + score);
        questions();
    }
})();*/

(function() {
    //CONSTRUCTOR
    var Questions = function(question, a, b, c, correctAnswer) {
        this.question = question;
        this.a = a;
        this.b = b;
        this.c = c;
        this.correctAnswer = correctAnswer;
    }

    var azula = new Questions('Who is my favorite Avatar: The Last Airbender character?',
                              'A = Zuko',
                              'B = Toph',
                              'C = Azula',
                              'C');
    var philippines = new Questions('Where was I born?',
                                    'A = Philippines',
                                    'B = Korea',
                                    'C = Malaysia',
                                    'A');
    var starwars = new Questions('Which world do I think would be fascinating to live in?',
                                 'A = Game of Thrones',
                                 'B = Ghost in the Shell',
                                 'C = Star Wars',
                                 'C');
    var questionsArr = [azula, philippines, starwars];

    var score = 0;
    var gamePlaying = true;
    var randomizer;
    
    //MAIN FUNCTION FOR QUESTIONS
    Questions.prototype.promptQuestion = function() {
        console.log(this.question);
        console.log(this.a); console.log(this.b); console.log(this.c);
        //SET TO A VARIABLE TO AVOID NUMEROUS PROMPTS
        var answer = prompt(this.question);
        if (answer === 'exit') {
            //STOP THE GAME IF EXIT
            gamePlaying = false;
            console.log('Stopped.');
            console.log('Final Score: ' + score);
        } else if (answer === null) {
            console.log('Skipped. Type \'exit\' to exit.');
            console.log('Score: ' + score);
            console.log('');
        } else if (answer.toUpperCase() === this.correctAnswer) {
            //ADD SCORE IF CORRECT
            score++;
            console.log('Your Answer: ' + answer);
            console.log('Correct!');
            console.log('Score: ' + score);
            console.log('');
        } else if (answer.toUpperCase() !== this.correctAnswer) {
            console.log('Your Answer: ' + answer);
            console.log('Inorrect.');
            console.log('Score: ' + score);
            console.log('');
        }
    }
    //LOOPING CONDITION
    while (gamePlaying === true) {
        randomizer = Math.floor(Math.random() * questionsArr.length);
        questionsArr[randomizer].promptQuestion();
    }
})();