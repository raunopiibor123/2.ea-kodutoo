/* TYPER */
let counter=0;
let length=0;
let score = 0;
let streak = 0;

const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.generatedWordLength=0 
  this.length = length
  this.counter = counter
  this.splitScore = 0
  this.score = 0
  
  //this.init()
}



function init () {
  scoreContainer = document.querySelector('score')
}



window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    console.log("test1")
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.form = document.getElementsByTagName('form')[0]
    this.ctx = this.canvas.getContext('2d')

    this.form.style.display = "none"

    this.canvas.style.display = "block"
    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]
    this.word = new Word(wordFromArray, this.canvas, this.ctx)
	length = generatedWordLength
	counter = this.guessedWords
	const splitScore = generatedWordLength * streak
	this.score = this.score + splitScore
	score = this.score + score
	
  

  },
 
  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
	  streak +=1
	  console.log(streak)
      if (this.word.left.length === 0) {
        this.guessedWords += 1

		
        this.generateWord()
      }

      this.word.Draw()
    }
	else{
		streak = 0
	}
  }

}


/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
	
	this.ctx.textAlign = 'left'
    this.ctx.font = '40px Arial'
	this.ctx.strokeStyle="red";
	this.ctx.fillText("Guessed Words:",40 , 80)
    this.ctx.fillText(counter,350 , 80)
	this.ctx.fillText("Word length:",40 , 150)
	this.ctx.fillText(length,280 , 150)
	this.ctx.fillText("Score:",40 , 220)
	this.ctx.fillText(score,170 , 220)
	this.ctx.rect(20,20,600,230);
	this.ctx.stroke();
	this.ctx.fillText("Streak:",1700 , 80)
	this.ctx.fillText(streak,1850 , 80)
	this.ctx.rect(1650,20,600,230);
	this.ctx.stroke();
	
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}





/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])

  }

  return tempArray
}

window.onload = function () {
  const typer = new TYPER()
  window.typer = typer
}
