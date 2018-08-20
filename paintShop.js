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
                let isReadyOnly = false;
                if(itemList.length === 1){
                    isReadyOnly = true;
                }
                if(element === 'M' || element === 'G'){
                    customElements[customElements.length-1].finish = element;
                } else {
                    customElements.push({color: parseInt(element), isReadyOnly: isReadyOnly});
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

function candidateSolution(customer, colorSelected){
    let candidate = [];

    customer.forEach(element => {
        let colorIndex = element.color -1;
        
        if(customer.length === 1){
            return;
        } else {
            if(colorSelected.colors[colorIndex].finish === null){
                candidate.push({color: element.color, 
                    finish: element.finish});
            }
        }
    });

    return candidate;
}

function mixColor(data){
    //Set the size of the array
    let resultCandidates = [];
    const colorSelected = { hasMatte: false, colors: [], hasNoSolution: false };
    //Load color array
    for(let i = 0; i < data.numColors; i++){
        colorSelected.colors.push({ color: i+1, finish: null, isReadyOnly: false });
    }

    //Sort customer preferences by number of colors
    data.customerPreferences.sort((a,b) => {       
        return a.length - b.length;
    });

    data.customerPreferences.forEach(customer => {
        
        customer.forEach(element => {
            let colorIndex = element.color -1;

            if(customer.length === 1){
                if(colorSelected.colors[colorIndex].finish !== null
                    && colorSelected.colors[colorIndex].finish !== element.finish 
                    && colorSelected.colors[colorIndex].isReadyOnly){
                    colorSelected.hasNoSolution = true;
                    return;
                }

                colorSelected.colors[colorIndex].finish = element.finish;
                colorSelected.colors[colorIndex].isReadyOnly = true;
            } else {
                let checkCandidates = candidateSolution(customer, colorSelected);

                resultCandidates = resultCandidates.concat(checkCandidates);
                if(checkCandidates.length > 1){
                    return;
                }

                for(let candidate of resultCandidates){
                    colorSelected.colors[candidate.color-1] = {color: candidate.color, 
                        finish: candidate.finish, isReadyOnly: false};
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
            outputString += item.finish === null ? 'G ' : item.finish  +' ';
        });
        console.log(outputString);
    }

} catch (err) {
    console.error(err);
    process.exit(1);
}

