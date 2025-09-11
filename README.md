# Dice Souls Companion

[Web version](https://dice-souls-companion.vercel.app) | This version does not include all 
features, such as shortcuts and the separate dice window.

This app was made to help a friend with his dice game, the [Dice Souls](https://drive.google.com/file/d/1ODhDLewWjsp1lCUB21AmkWESVzz3Rb25/view).

## Features
- [Random Background Images](#random-background-images)
- [Manual Dice Throw](#manual-dice-throw)
- [List of Current Effects](#list-of-current-effects)
  - [Reroll all effects](#reroll-all-effects)
  - [Reroll an effect](#reroll-an-effect)
  - [Replace an effect](#replace-an-effect)
  - [Remove an effect](#remove-an-effect)
- [Server Endpoint for Current Results](#server-endpoint-for-current-results)
- [Effects log](#effects-log)
- [Green Background](#green-background)
- [Global Shortcuts](#global-shortcuts)
- [Profiles](#profiles)

## Random Background Images
Everytime you open the app it will choose a different background image.

## Manual Dice Throw
You can manual throw which type of die, **red**, **black** and **blue**. Use the **left click** 
to increase the dice count and **right click** to decrease it.

## List of Current Effects
The app keeps track of all effects rolled. With options to manage it.

### Reroll all effects
Option to clear the current effect's list and roll the same amount of dice to get new results.

### Reroll an effect
Option to roll a dice to replace a specific result.

### Replace an effect
Option to choose an effect to replace the selected one.

### Remove an effect
Option to remove an effect from the current results list.

## Server endpoint for current results
While the app is running you can access `http://localhost:3500/current` to get an HTML list of
the current `Active` and `Temporary` effects.

Result example:
```html
<p>Efeitos Ativos:</p>
<br/>
<ul>
  <li>Proibido Curar</li>
</ul>

<br/>
<br/>

<p>Temporários:</p>
<br/>
<ul>
  <li>One Hit Kill</li>
</ul>
```

## Effects log
A simple pop up that shows which effect got added or removed. Only for current session.

## Green Background
You can choose to use a green background for the dice throws. Which the can configured in the
settings. And you can choose to use a separate green window.

## Global Shortcuts
**Only desktop version.** You can set some keyboard commands as shortcuts for adding, removing
and thorwing dice.

## Profiles
You can manager profiles, to use different sets of effects.
