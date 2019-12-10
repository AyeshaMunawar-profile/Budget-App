// Used IFFE (immediately invoked function expression) to store a private variables
// to create data privacy by creating a new scope
// Description:
// After execution of each outer function the closures are created to which only the
// interfaces have access thus creating data encapsulation for the inner functionality and private data
// variables of each controller
//BUDGET CONTROLLER
let budgetController = (function () {

})();
//UI CONTROLLER
let UIController = (function () {
    var DOMstring = {
        inputType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        addButton: ".add__btn"
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstring.addDescription).value,
                value: document.querySelector(DOMstring.addValue).value
            };
        },
        getDOMStrings: function(){
            return DOMstring;
        }
    };
})();
//GLOBAL APP CONTROLLER
// Connect Ui controller and budget controller
let controller = (function (budgetCrl, UICrl) {
    let DOMstrings= UICrl.getDOMStrings();
    let crlAddItem = function () {
        // 1. get the field input data
        let input = UICrl.getInput();
        console.log(input);
        // 2. add the item to the list as income or expense through budget controller

        // 3. add the item to the UI list of expenses or income items based on the type of item

        // 4. calculate the overall budget

        // 5. display the overall budget on UI
    };


    document.querySelector(DOMstrings.addButton).addEventListener('click', crlAddItem);
    document.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
            crlAddItem();
        }
    });

})(budgetController, UIController);
