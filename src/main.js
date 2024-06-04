const FooEtAlParameterization = require("./FooEtAlParameterization");

// Readline being used to create interactivity with the user input
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Welcome to Foo et al Parameterization!"); 

// On the command line will retrieve the value of the input
let args = process.argv.slice(2);
// Checks if there was an input argument on the command line
if(args.length > 0){
    // retrieving the radius from argument on the command line
    const [radius] = args;
    const radiusInput = parseFloat(radius);
    if(radiusInput <= 0 || isNaN(radiusInput)){
        console.log("ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE IN THE COMMAND LINE\n")
        process.exit(1);
    }
    let commandInput = new FooEtAlParameterization(radiusInput);
    // Returns the value to the 5th decimal place
    let commandInputRounded = commandInput.volumeCalculation().toFixed(5);
    console.log(`The volume of the radius is: ${commandInputRounded}`);
    // Exits the commandline input after the output is shown
    process.exit(0);
} else{
    // Interactive mode  
    mainMenu();
}


function handleRadiusInput() {
    readline.question("Enter a value for the radius: \n", radius => {
        if (radius <= 0 || isNaN(radius)) {
            console.log("ERROR, INVALID VALUE, PLEASE ENTER A VALID VALUE\n")
            handleRadiusInput();
        } else {
            let fooInput = new FooEtAlParameterization(radius);
            let fooInputRounded = fooInput.volumeCalculation().toFixed(5);
            console.log(`The volume of the radius is: ${fooInputRounded}\n`);
            mainMenu();
        }
    });
}



function mainMenu(){
    readline.question("Please select an option:\n\n(1): Calculate Volume of a Sphere \n(2): Exit\n", 
    option => {
        switch(option){
            case '1':
                handleRadiusInput();
                break;
            case '2':
                console.log("Exiting...");
                readline.close();
                break;
            default:
                console.log("Invalid input, please input a valid option");
                mainMenu();
                break;
        }
    });
}