// Used IFFE (immediately invoked function expression) to store a private variables
// to create data privacy by creating a new scope
// Description:
// After execution of each outer function the closures are created to which only the
// interfaces have access thus creating data encapsulation for the inner functionality and private data
// variables of each controller
//BUDGET CONTROLLER
let budgetController = (function () {
        //function constructor for income object
        let Income = function (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
        //function constructor of expense object
        let Expense = function (id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
        let budgetData = {
            allItems: {
                exp: [],
                inc: []
            },
            totalItems: {
                totalIncome: 0,
                totalExpenses: 0
            },
            percentages: {
                percentageIncome: 0,
                percentageExpense: 0
            },
            overallBudget: 0,
            itemsCount: 0
        };
        return {
            addItems: function (type, des, val) {
                let newItem, ID;
                // create new ID
                if (budgetData.allItems[type].length === 0) {
                    ID = 0;
                } else {
                    ID = budgetData.allItems[type][budgetData.allItems[type].length - 1].id + 1;
                }
                budgetData.itemsCount++;
                // create new item based on type i.e inc or exp
                if (type === 'exp') {
                    newItem = new Expense(ID, des, val);

                } else if (type === 'inc') {
                    newItem = new Income(ID, des, val);
                }
                // add new item to the respective data structure based on type i.e exp or inc
                budgetData.allItems[type].push(newItem);
                return newItem;
            }
            ,
            testing: function () {
                console.log(budgetData);
            }
        }

    }
)();
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
        getDOMStrings: function () {
            return DOMstring;
        }
    };
})();
//GLOBAL APP CONTROLLER
// Connect Ui controller and budget controller
let controller = (function (budgetCrl, UICrl) {
    let setupEventListeners = function () {
        let DOMstrings = UICrl.getDOMStrings();
        document.querySelector(DOMstrings.addButton).addEventListener('click', crlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
                crlAddItem();
            }
        });
    };
    let crlAddItem = function () {
        let input, newItem;
        // 1. get the field input data
        input = UICrl.getInput();
        // 2. add the item to the appropriate data structure as income or expense through budget controller
        newItem = budgetCrl.addItems(input.type, input.description, input.value);
        budgetCrl.testing();
        // 3. add the item to the UI list of expenses or income items based on the type of item

        // 4. calculate the overall budget


        // 5. display the overall budget on UI
    };

    return {
        init: function () {
            console.log("The Application has started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();