#!/usr/bin/env node
import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { questions } from "./quizdata.js";

let score = 0;
let timeLeft = 30; // Total quiz time in seconds
let timer;

// Starts countdown timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    process.stdout.write(chalk.gray(`\r⏳ Time Left: ${timeLeft}s `));

    if (timeLeft <= 0) {
      clearInterval(timer);
      console.log(chalk.red("\n\n⏰ Time's up!"));
      endGame();
    }
  }, 1000);
}

// Asks quiz questions one by one
async function askQuestions() {
  for (const [index, q] of questions.entries()) {
    console.log(chalk.cyanBright(`\nQuestion ${index + 1}: ${q.question}`));

    const userAnswer = await select({
      message: "Choose an answer:",
      choices: q.choices.map(choice => ({
        name: choice,
        value: choice
      }))
    });

    if (userAnswer === q.answer) {
      console.log(chalk.green("✅ Correct!"));
      score++;
    } else {
      console.log(chalk.red(`❌ Incorrect. Correct answer: ${q.answer}`));
    }

    if (timeLeft <= 0) break; // End loop if time is up
  }

  clearInterval(timer);
  endGame();
}

// Ends the game and shows the score
function endGame() {
  console.log(chalk.yellow(`\n🏁 Quiz Complete! Your score: ${score}/${questions.length}`));
  process.exit(0);
}

// Starts the game
function startGame() {
  console.log(chalk.magenta("\n🎉 Welcome to the CLI Trivia Game!"));
  console.log(chalk.blue(`You have ${timeLeft} seconds to complete the quiz.`));
  startTimer();
  askQuestions();
}

startGame();