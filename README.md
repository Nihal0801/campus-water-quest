# Campus Water Quest

A responsive HTML, CSS, and JavaScript prototype by Nihal Patel, developed with AI assistance from the [GCA-Classroom Water Quest starter](https://github.com/GCA-Classroom/05-cw-game-water-quest). The starter supplied random spawning, a grid, and charity: water image assets. This version completes and expands the behavior and layout.

## Play

Open `index.html` or serve this folder with a static HTTP server. No installation, dependencies, account, or build step is required.

- Start a 30-second round. Tap/click yellow cans for **+10 points**.
- Spills subtract **5 points**, with a minimum score of zero.
- One random target appears every **1.2 seconds** (80% can, 20% spill). Missed targets and empty tiles have no penalty.
- Finish with **100+ points** to win. Reaching the goal before the timer ends does not end the round; later penalties still count.
- Use **1–9**, left to right by row, or native button controls. **P** pauses/resumes; held-key repeats are ignored.
- **Reset** immediately clears the previous round and starts a fresh round. **Play again** does the same after results.
- Pause freezes time and input. Leaving the browser tab auto-pauses; returning requires Resume.

## Rubric coverage

| Criterion | Implementation |
| --- | --- |
| Core interactivity | Each can updates score, progress, and live feedback |
| Responsive layout | Desktop columns become a single column at 720 px; grid scales to available width |
| Brand and visuals | Provided charity: water logo and jerry can imagery; yellow #FFC907 and blue #2E9DF7; mission links |
| Challenge bonus | Random brown spills with an X and SPILL label apply a real score penalty |
| Reset bonus | Reset clears score, targets, milestones, celebration, and the old interval |
| Celebrate wins bonus | Final score of at least 100 triggers confetti and a win message; reduced-motion users see a static celebration |

The submission PDF contains the three written reflections. Their first-person language should be reviewed and personalized by the student.

## Prototype scope

There are no real perks, coupons, donations, accounts, or water deliveries. Points are for play. The earlier campus perk concept is deferred to keep this prototype focused. The ending includes an education message for every player.

## Sources and attribution

- Starter and supplied imagery: https://github.com/GCA-Classroom/05-cw-game-water-quest
- Mission and education: https://www.charitywater.org/global-water-crisis/education
- Brand resources: https://www.charitywater.org/about/media

This student exercise is inspired by charity: water and does not claim official partnership.
