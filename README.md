Application to track the results of Scott Logic Newcastle's 2018 World Cup Sweepstake

## Table of Contents

- [What is this?](#What-is-this?)
- [Technical Specifications](#Technical-Specifications)

## What is this?

This is a sweepstake competition which will run alongside the 2018 FIFA World Cup, but with a twist:
Players will draw 5 teams from a hat, the first 2 teams will be the "goal" teams, the subsequent 3 teams will be the "outcome" teams. The team names will then be returned to the hat for the next player. They will also be asked to predict the total goals that will be scored over the competition.

During the competition points are rewarded as follows:
 * 1 Point for every goal scored by a "goal" team.
 * 3 Points for every win achieved by an "outcome" team.
 * 1 Point for every draw achieved by an "outcome" team.

At the end of the competition the player with the most points will claim the top prize. In the even of a tie, it will come down to whichever player

During the competition this application will display the teams picked by each player, along with the total goals they predicted and their current points tally. It will also display the total goals, wins and draws for each team along with the actual current total goals.

## Technical Specifications

The app is fairly barebones as it was thrown together quite quickly to be ready in time for the cup.

The UI is a standard React (no Redux or other addons/middleware) served by an express server which also hosts the services to fetch player data.

The data is served by: http://api.football-data.org/ Which should be updated during the competition, examples of how the data is formatted can be seen in the historical competitions stored here.
