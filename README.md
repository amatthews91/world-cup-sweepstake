Application to track the results of Scott Logic Newcastle's 2018 World Cup Sweepstake

## Table of Contents

- [Table of Contents](#table-of-contents)
- [What is this?](#what-is-this)
- [Technical Specifications](#technical-specifications)
- [Running Locally](#running-locally)
  - [Setting up the code](#setting-up-the-code)
  - [Configuring the database](#configuring-the-database)
    - [Players](#players)
    - [Last API Lookup](#last-api-lookup)

## What is this?

This is a sweepstake competition which will run alongside the 2018 FIFA World Cup, but with a twist:
Players will draw 5 teams from a hat, the first 2 teams will be the "goal" teams, the subsequent 3 teams will be the "outcome" teams. The team names will then be returned to the hat for the next player. They will also be asked to predict the total goals that will be scored over the competition.

During the competition points are rewarded as follows:
 * 1 Point for every goal scored by a "goal" team.
 * 3 Points for every win achieved by an "outcome" team.
 * 1 Point for every draw achieved by an "outcome" team.

At the end of the competition the player with the most points will claim the top prize. In the even of a tie, it will come down to whichever player guessed closest to the correct number of goals (under or over).

During the competition this application will display the teams picked by each player, along with the total goals they predicted and their current points tally. It will also display the total goals, wins and draws for each team along with the actual current total goals.

## Technical Specifications

The app is fairly barebones as it was thrown together quite quickly to be ready in time for the cup.

The UI is a standard React (no Redux or other addons/middleware) served by an express server which also hosts the services to fetch player data.

The data is served by: http://api.football-data.org/ which will be updated during the competition.

## Running Locally
### Setting up the code
1. Clone this repository.
2. Run `npm install` in the root.
3. Create a file name `api-key.txt` in the root, this will contain the API key from football data.

### Configuring the database
The database is driven by MongoDB and the structure is as follows:

| Collection      | Usage                                                                    |
|-----------------|-------------------------------------------------------------------------:|
| fixtures        | Data of all fixtures past and present for the tournament                 |
| last-api-lookup | The last time fixture data was pulled from the API in ISO 8601           |
| players         | Data of all the players in the sweepstake.                               |
| teams           | Data of all the teams in the tournament and whether they are eliminated. |

#### Players
The `players` table is in the format:

```
{
  teams: {
    name: "Player name",
    goalsPredicted: 60,
    goals: [country1, country2],
    outcomes: [country3, country4, country5]
  }
}
```

#### Last API Lookup
The `last-api-lookup` collection is a single entry in the form:

`{ time: "2014-09-08T08:02:17-05:00" }`