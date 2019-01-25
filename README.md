# Alien Armageddon

## Version 1
Version 1 is am implementation that is expecting a full map ie.

```
  Foo north=Bar west=Baz south=Qu-ux
  Bar south=Foo west=Bee
  Bee east=Bar
  Qu-ux north=Foo
  ```
It is using the approach that the alien moves himself from city to city. When a city is destroyed it destroys all the other aliens inhabiting the city. 

Running the Game

```
  npm run version1
```
  - 1st Prompt: You will prompted to enter the file path of the data you would like to create a map out of
  - 2nd Prompt: You will be asked how many aliens you would like to unleash on to the map.
  - The program will run and you will see output based on the destruction. 
  - Once finished you will see the out put of the cities still standing

## Version 2

Version 2 is am implementation of use of a partial map ie.

```
  Foo north=Bar west=Baz south=Qu-ux
  Bar south=Foo west=Bee
```

It is using the implementation that the alien is not aware of where it is but the cities play catch with them. All aliens make a move then the city checks if it has greater than 2 aliens it destroys itself and all the inhabitants.

This version is more minimal as I am not using a NPM module to facilitate any beautification of the terminal. 

The approach of running the game for version2 is different

```
cd version2
cat <test_data_file_path> | node index.js alien=<alien_amount>
```
### OR

```
cat <test_data_file_path> | npm run version2 alien=<alien_amount>
```

Replace the data inside <___> to your preferred locations

## Map Generator
The map generator generates test_data to be used for the games.
  - Version1: you need to comment out line 175 and uncomment 138
  - Version2: you need to comment out line 138 and uncomment 175
    - run node mapGenerator.js <square_root of amount_of_cities>
      - plesase be aware that amount_of_cities will be amount_of_cities to the power of 2 ie. why <square_root of amount_of_cities>

## Assumptions Made
  - Cities and the directions are always strings
  - Alien count will be a int.
  - If an alien is stuck it dies and does not keep trying to move
  - 

## Upgrades
  - write tests, to fully back tests all approaches
  - write a version3 in go to benchmark the differences
  - create a benchmark table




### eslint turn offs:
  - turned off [no-console] because this program is written for the terminal