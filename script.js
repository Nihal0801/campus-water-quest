// Expanded from GCA-Classroom's Water Quest starter. No libraries or build step.
(() => {
  'use strict';
  const ROUND_MS = 30000;
  const SPAWN_MS = 1200;
  const GOAL = 100;
  const winningMessages = ['You made every can count!', 'A little play. A quest complete!', 'Study break, mission accomplished!'];
  const retryMessages = ['One more quest? You can do this.', 'Keep going, one can at a time.', 'A new round is a fresh start.'];
  const $ = id => document.getElementById(id);
  const cells = [];
  let state = 'ready'; // ready -> playing <-> paused -> ended
  let score = 0;
  let remaining = ROUND_MS;
  let deadline = 0;
  let nextSpawn = 0;
  let activeTile = -1;
  let activeKind = null;
  let loopId = null;
  let celebrationId = null;
  let halfwayShown = false;
  let goalShown = false;

  function createGrid() {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'grid-cell';
      cell.disabled = true;
      cell.setAttribute('aria-label', `Tile ${i + 1}, empty`);
      cell.innerHTML = `<span class="tile-number" aria-hidden="true">${i + 1}</span>`;
      cell.addEventListener('click', () => collect(i));
      cells.push(cell);
      $('board').appendChild(cell);
    }
  }

  function clearTarget() {
    cells.forEach((cell, i) => {
      cell.classList.remove('is-can', 'is-spill');
      cell.querySelector('.target')?.remove();
      cell.setAttribute('aria-label', `Tile ${i + 1}, empty`);
    });
    activeTile = -1;
    activeKind = null;
  }

  function spawnWaterCan() {
    clearTarget();
    activeTile = Math.floor(Math.random() * cells.length);
    activeKind = Math.random() < 0.8 ? 'can' : 'spill';
    const cell = cells[activeTile];
    cell.classList.add(`is-${activeKind}`);
    cell.setAttribute('aria-label', `Tile ${activeTile + 1}, ${activeKind === 'can' ? 'yellow can, collect 10 points' : 'spill, avoid losing 5 points'}`);
    const target = document.createElement(activeKind === 'can' ? 'img' : 'span');
    target.className = `target ${activeKind === 'spill' ? 'spill-target' : ''}`;
    target.setAttribute('aria-hidden', 'true');
    if (activeKind === 'can') {
      target.src = 'img/water-can.png';
      target.alt = '';
      target.draggable = false;
    } else {
      target.innerHTML = '×<small>SPILL</small>';
    }
    cell.appendChild(target);
  }

  function feedback(message, penalty = false) {
    $('feedback').textContent = message;
    $('feedback').classList.toggle('penalty', penalty);
  }

  function updateStats() {
    $('score').textContent = score;
    $('timer').textContent = Math.ceil(remaining / 1000);
    $('timer').parentElement.parentElement.classList.toggle('urgent', remaining <= 5000);
    $('progress-text').textContent = `${score} / ${GOAL}`;
    const progress = Math.min(100, score / GOAL * 100);
    $('progress-fill').style.width = `${progress}%`;
    $('goal-progress').setAttribute('aria-valuenow', progress);
    $('goal-progress').setAttribute('aria-valuetext', `${score} points. Goal: ${GOAL}.`);
    $('goal-label').textContent = score >= GOAL ? 'Goal reached. Keep it above 100!' : 'The goal: 100 points';
  }

  // A monotonic deadline avoids a slow interval extending the round.
  function tick() {
    if (state !== 'playing') return;
    const now = performance.now();
    remaining = Math.max(0, deadline - now);
    if (remaining === 0) return endGame();
    if (now >= nextSpawn) {
      spawnWaterCan();
      nextSpawn = now + SPAWN_MS;
    }
    updateStats();
  }

  function collect(index) {
    if (state !== 'playing') return;
    // Reject clicks after the deadline, even if a timer callback was delayed.
    if (performance.now() >= deadline) return endGame();
    if (index !== activeTile) return;
    const isCan = activeKind === 'can';
    score = Math.max(0, score + (isCan ? 10 : -5));
    clearTarget(); // Consume once, so double taps cannot score twice.
    let message = isCan ? '+10! Nice catch.' : 'Spill! −5 points. Watch for yellow cans.';
    if (score >= GOAL && !goalShown) {
      message = '+10! Goal reached. Keep 100+ until the end!';
      goalShown = true;
    } else if (score >= GOAL / 2 && !halfwayShown) {
      message = '+10! Halfway to your goal!';
      halfwayShown = true;
    }
    feedback(message, !isCan);
    updateStats();
  }

  function setBoardEnabled(enabled) {
    cells.forEach(cell => { cell.disabled = !enabled; });
  }

  function showOverlay(title, copy, button, art) {
    $('overlay-title').textContent = title;
    $('overlay-copy').textContent = copy;
    $('start-game').textContent = button;
    $('overlay-art').textContent = art;
    $('overlay').hidden = false;
  }

  function clearCelebration() {
    clearTimeout(celebrationId);
    $('confetti').replaceChildren();
    $('confetti').classList.remove('static-celebration');
  }

  function celebrate() {
    clearCelebration();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('confetti').classList.add('static-celebration');
    } else {
      const colors = ['#ffc907', '#2e9df7', '#8bd1cb', '#173c43'];
      for (let i = 0; i < 60; i++) {
        const piece = document.createElement('i');
        piece.className = 'confetti-piece';
        piece.style.setProperty('--x', `${Math.random() * 100}%`);
        piece.style.setProperty('--color', colors[i % colors.length]);
        piece.style.setProperty('--delay', `${Math.random() * 0.45}s`);
        piece.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
        $('confetti').appendChild(piece);
      }
    }
    celebrationId = setTimeout(clearCelebration, 3500);
  }

  function startGame() {
    clearInterval(loopId);
    clearCelebration();
    clearTarget();
    score = 0;
    remaining = ROUND_MS;
    halfwayShown = false;
    goalShown = false;
    state = 'playing';
    deadline = performance.now() + remaining;
    nextSpawn = performance.now() + SPAWN_MS;
    $('overlay').hidden = true;
    $('result-mission').hidden = true;
    $('round-status').textContent = 'QUEST IN PROGRESS';
    $('pause-game').disabled = false;
    $('pause-game').textContent = 'Pause';
    setBoardEnabled(true);
    feedback('Go! Tap yellow cans. Leave the spills.');
    updateStats();
    spawnWaterCan();
    loopId = setInterval(tick, 50);
    cells[0].focus({ preventScroll: true });
  }

  function pauseGame(auto = false) {
    if (state !== 'playing') return;
    remaining = Math.max(0, deadline - performance.now());
    if (remaining === 0) return endGame();
    state = 'paused';
    clearInterval(loopId);
    setBoardEnabled(false);
    $('round-status').textContent = 'TAKE A BREATHER';
    $('pause-game').textContent = 'Resume';
    showOverlay('Your quest is paused.', 'Your score and time are safe. Pick up where you left off.', 'Resume my quest', 'Ⅱ');
    feedback(auto ? 'Paused because you left the tab. Resume when you’re ready.' : 'Take your time. The clock is paused.');
    updateStats();
    if (!auto) $('start-game').focus({ preventScroll: true });
  }

  function resumeGame() {
    if (state !== 'paused') return;
    state = 'playing';
    deadline = performance.now() + remaining;
    nextSpawn = performance.now() + SPAWN_MS;
    $('overlay').hidden = true;
    $('pause-game').textContent = 'Pause';
    $('round-status').textContent = 'QUEST IN PROGRESS';
    setBoardEnabled(true);
    loopId = setInterval(tick, 50);
    feedback('Welcome back. Keep collecting!');
    cells[Math.max(0, activeTile)].focus({ preventScroll: true });
  }

  function endGame() {
    if (state === 'ended') return;
    state = 'ended';
    remaining = 0;
    clearInterval(loopId);
    clearTarget();
    setBoardEnabled(false);
    $('pause-game').disabled = true;
    $('round-status').textContent = 'QUEST COMPLETE';
    const won = score >= GOAL;
    const messages = won ? winningMessages : retryMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    showOverlay(won ? 'Quest complete!' : 'Nice effort. Try again?', `${score} points · ${message}`, 'Play again', won ? '★' : '↗');
    feedback(won ? `You won with ${score} points! Clean water changes everything.` : `${score} points. Aim for 100 next time. You’ve got this.`);
    $('result-mission').hidden = false;
    updateStats();
    if (won) celebrate();
    $('overlay-title').focus({ preventScroll: true });
  }

  createGrid();
  updateStats();
  $('start-game').addEventListener('click', () => state === 'paused' ? resumeGame() : startGame());
  $('reset-game').addEventListener('click', startGame);
  $('pause-game').addEventListener('click', () => state === 'playing' ? pauseGame() : resumeGame());
  document.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^[1-9]$/.test(event.key) && state === 'playing') {
      event.preventDefault();
      collect(Number(event.key) - 1);
    } else if (event.key.toLowerCase() === 'p' && ['playing', 'paused'].includes(state)) {
      event.preventDefault();
      state === 'playing' ? pauseGame() : resumeGame();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseGame(true);
  });
})();
