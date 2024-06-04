# Foo et al. Parameterization
This software package implements the Foo et al. parameterization calculation that takes in the radius and 
returns the volume and serves as a base for adding more scientific features

## Features

- Interactive command-line interface
- Support for command-line arguments
- Unit Tests utilizing Mochai and Chai

## Repo locations
- https://bitbucket.org/alonso6501/foo-et-al/src/main/
- https://gitlab.com/foo-et-la/foo-et-la
- https://github.com/Alonso650/foo-et-al

## Installation
Install via npm


```bash
npm install foo-et-al-parameterization

#Example usage:
const fooEtAlParameterization = require('foo-et-al-parameterization');
const radius = 2;
const result = new fooEtAlParameterization(radius);
console.log(result.volumeCalculation());

#Command Line with arguments
node main.js 2
# Example output: Welcome to Foo et al Parameterization!\nThe volume of the radius is: 33.51032\n


#Interactive Mode without arguments
node src/main.js

# To run unit tests
npm test
