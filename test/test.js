const assert = require("assert");
const { expect } = require("chai");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const path = require('node:path');
const FooEtAlParameterization = require("../src/FooEtAlParameterization");

describe('FooEtAlParameterization', function(){
    it('should return the correct volume of the sphere which is 33.51032 with a radius of 2', function() {
        const fooEx = new FooEtAlParameterization(2);
        const result = fooEx.volumeCalculation();
        assert.equal(result, (4/3) * Math.PI * Math.pow(2, 3));
    });
});

describe('Command Line Interface Testing', function(){
    it('should calculate the volume of the radius from command-line arguments', (done) => {
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        exec(`node ${scriptPath} 3`, (error, stdout, stderr) => {
            if (error) {
                done(error);
                return;
            }
            expect(stdout).to.include('Welcome to Foo et al Parameterization!\nThe volume of the radius is: 113.09734\n');
            done();
        });
    });

    it('should give an error if the radius is not a number', (done) => {
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        exec(`node ${scriptPath} d`, (error, stdout, stderr) => {
            const errMessage = "ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE IN THE COMMAND LINE";
            expect(stdout).to.include(errMessage);    
            done();
        });
    });

    it('should give an error if the radius is 0', (done) => {
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        exec(`node ${scriptPath} 0`, (error, stdout, stderr) => {
            const errMessage = "ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE IN THE COMMAND LINE";
            expect(stdout).to.include(errMessage);
            done();
        });
    });

    it('should give an error if the radius is less than 0', (done) => {
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        exec(`node ${scriptPath} -5`, (error, stdout, stderr) => {
            const errMessage = "ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE IN THE COMMAND LINE";
            expect(stdout).to.include(errMessage);
            done();
        });
    });
});

// Using async/await and promises because kept encountering
// a time exceed error
describe('Interactive Testing with input', function(){
    it('should load the file, go through the first option and input a valid value, then exit the program', async () =>{
        // Getting the path to the main.js file
        const scriptPath = path.resolve(__dirname, '../src/main.js');

        // Using spawn for running the main.js file
        const child = spawn('node', [scriptPath]);

        let output = '';
        let resolved = false;

        // Created a promise to wait for the initial prompt to avoid timeout error
        const dataWait = new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                output += data.toString();
                // Checking if the initial prompt is displayed on the command line
                if(!resolved && output.includes('Please select an option:')){
                    // Resolve the promise once the prompt is displayed
                    resolve();
                    resolved = true;
                }
            });

            // Handling errors from the child process
            child.stderr.on('data', (data) => {
                console.error(data.toString());
                // reject the promise since there was an error
                reject(data.toString());
            });
        });

        // Waiting for the initial prompt to load so time would not exceed
        await dataWait;

        // Selecting option 1 by sending input to the child process
        child.stdin.write('1\n');

        // Waiting for the prompt to enter a radius value
        while(!output.includes('Enter a value for the radius:')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Sending a radius value of 3 to the child process
        child.stdin.write('3\n');

        // Waiting for the output to display the calculated volume
        while(!output.includes('The volume of the radius is:')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Selecting option 2 to exit out of the program
        child.stdin.write('2\n');

        // Waiting for the program to display the initial prompt again
        // then the 2 option will be selected
        while(!output.includes('Please select an option:')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        //End the child process
        child.kill();
    });

    // New test for inputting a wrong value in the menu
    it('should display an error message for an invalid menu option', async () =>{
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        const child = spawn('node', [scriptPath]);

        let output = '';
        let resolved = false;

        const dataWait = new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                output += data.toString();
                if(!resolved && output.includes('Please select an option:')){
                    resolve();
                    resolved = true;
                }
            });

            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });
        });

        await dataWait;

        // Selecting an invalid option at the main menu
        child.stdin.write('a\n');

        // Waiting for the error message to be displayed
        while(!output.includes('Invalid input, please input a valid option')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Ending the child process
        child.kill();
    });

    it('should load the file, exit from input 2', async () =>{
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        const child = spawn('node', [scriptPath]);

        let output = '';
        let resolved = false;

        const dataWait = new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                output += data.toString();
                if(!resolved && output.includes('Please select an option:')){
                    resolve();
                    resolved = true;
                }
            });

            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });
        });

        await dataWait;

        // Selecting option to exit
        child.stdin.write('2\n');

        // Waiting for the error message to be displayed
        while(!output.includes('Exiting...')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Ending the child process
        child.kill();
    });

    it('should load the menu, input the first option, then input an invalid value for the radius', async() => {
        this.timeout(5000);
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        const child = spawn('node', [scriptPath]);

        let output ='';
        let resolved = false;

        const dataWait = new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                output += data.toString();
                if(!resolved && output.includes('Please select an option:')){
                    resolve();
                    resolved = true;
                }
            });
            
            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });
        });

        await dataWait;

        // Selecting 1 to go into mode to enter radius value
        child.stdin.write('1\n');

        while(!output.includes('Enter a value for the radius:')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Selecting an invalid radius option
        child.stdin.write('d\n');

        while(!output.includes("ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE\n")){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        child.kill();
    });

    it('should load the menu, input the first option, then input an invalid value for the radius, then input a valid option', async function() {
        this.timeout(5000); // Set the timeout to 5 seconds
    
        const scriptPath = path.resolve(__dirname, '../src/main.js');
        const child = spawn('node', [scriptPath]);
    
        let output = '';
        let resolved = false;
    
        const dataWait = new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                output += data.toString();
                if (!resolved && output.includes('Please select an option:')) {
                    resolve();
                    resolved = true;
                }
            });
    
            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });
        });
    
        await dataWait;
    
        // Selecting 1 to go into mode to enter radius value
        child.stdin.write('1\n');
    
        while (!output.includes('Enter a value for the radius:')) { 
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    
        // Entering an invalid radius value
        child.stdin.write('0\n');
    
        // Checking for the error message
        while (!output.includes('ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE')) { 
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        child.stdin.write('4\n');

        while(!output.includes('Enter a value for the radius:')){
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    
        child.kill();
    });    
});

