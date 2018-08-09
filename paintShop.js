const fs = require('fs');

const inputFile = process.argv[2];

const txtParser = (input) => {
    const content = fs.readFileSync(input, 'utf8');
    const lines = content.split(/[\r\n]+/);

    const numColors = parseInt(lines.splice(0,1));
    const customerPreferences = [];

    lines.forEach(item => {
        if(item !== ''){
            let itemList = item.split(' ');
            const customElements = [];

            itemList.forEach(element => {
                if(element === 'M' || element === 'G'){
                    customElements[customElements.length-1].finish = element;
                } else {
                    customElements.push({color: parseInt(element)});
                }
            });
            customerPreferences.push(customElements);
        }
    });

    const output = {
        numColors: numColors,
        customerPreferences : customerPreferences
    }

    return output;
}

const NO_SOLUTION = 'No solution exists';

function mixColor(data){
    //Set the size of the array
    const colorSelected = { hasMatte: false, colors: [], hasNoSolution: false };
    colorSelected.colors = new Array(data.numColors);
    
    //Sort customer preferences by number of colors
    data.customerPreferences.sort((a,b) => {
        return a.length - b.length;
    });

    data.customerPreferences.forEach(customer => {
        
        customer.forEach(element => {
            let colorIndex = element.color -1;

            if(customer.length === 1){
                if(colorSelected.colors[colorIndex] !== undefined){
                    if(colorSelected.colors[colorIndex].finish !== element.finish 
                        && colorSelected.colors[colorIndex].isReadyOnly){
                        colorSelected.hasNoSolution = true;
                        colorSelected.colors[colorIndex] = undefined;
                    } else if(colorSelected.colors[colorIndex].finish !== element.finish){
                        colorSelected.colors[colorIndex].finish = element.finish;
                        colorSelected.colors[colorIndex].isReadyOnly = true;
                    }
                } else {
                    if(element.finish === 'M'){
                        colorSelected.hasMatte = true;
                    }
                    colorSelected.colors[colorIndex] = {color: element.color, finish: element.finish, isReadyOnly: true};
                }
            } else {
                if(colorSelected.colors[colorIndex] === undefined){
                    let finish = 'G';
                    if(!colorSelected.hasMatte){
                        finish = element.finish;
                    }
                    colorSelected.colors[colorIndex] = {color: element.color, finish: finish, isReadyOnly: false};
                } else if(colorSelected.colors[colorIndex].finish !== element.finish
                        && element.finish === 'G' 
                        && !colorSelected.colors[colorIndex].isReadyOnly){
                            colorSelected.colors[colorIndex].finish = element.finish;
                }
            }
            
        });
    });

    return colorSelected;
}


//Main App
try {
    const data = txtParser(inputFile);
    const result = mixColor(data);
    console.log(result);
    let outputString = '';

    if(result.hasNoSolution){
        console.log(NO_SOLUTION);
    } else {
        result.colors.forEach(item => {
            outputString += item.finish +' ';
        });
    }

    console.log(outputString);

} catch (err) {
    console.error(err);
    process.exit(1);
}

