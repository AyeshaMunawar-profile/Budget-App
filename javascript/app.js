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
            this.description = description ? description : 'income-' + id;
            this.value = value ? value : 0;
        };
        //function constructor of expense object
        let Expense = function (id, description, value) {
            this.id = id;
            this.description = description ? description : 'income-' + id;
            this.value = value ? value : 0;
        };

        let calculateTotal = function (type) { // type can be 'inc' or 'exp'
            let total = 0;
            budgetData.allItems[type].forEach(function (current) {
                total += current.value;
            });
            //store it in the budget data datastructure
            budgetData.totalItems[type] = total;
            return total;
        };

        let budgetData = { // datastructure to store budget information
            allItems: {
                exp: [],
                inc: []
            },
            totalItems: {
                inc: 0,
                exp: 0
            },
            incomeSpentPercentage: -1,
            budget: 0,
            itemsCount: 0
        };

        return {
            addItems: function (type, des, val) {
                let newItem, ID;
                // create new ID
                if (budgetData.allItems[type].length > 0) {
                    ID = budgetData.allItems[type][budgetData.allItems[type].length - 1].id + 1;
                } else {
                    ID = 0;
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
            },
            getbudget: function () {
                return {
                    budget: budgetData.budget,
                    totalIncome: budgetData.totalItems.inc,
                    totalExpenses: budgetData.totalItems.exp,
                    incomeSpentPercentage: budgetData.incomeSpentPercentage
                };
            },
            deleteItem: function (type, id) {

            }
            ,
            calculateBudget: function () {
                let totalIncome, totalExpense, totalBudget, incomeSpentPercentage;
                //1. calculate total income and expense
                calculateTotal('inc');
                calculateTotal('exp');
                //2. calculate total budget: income -expense
                budgetData.budget = budgetData.totalItems.inc - budgetData.totalItems.exp;
                //3. calculate the total percentage of income that we spent (only calculate it if income is > 0)
                if (budgetData.totalItems.inc > 0) {
                    budgetData.incomeSpentPercentage = Math.round((budgetData.totalItems.exp / budgetData.totalItems.inc) * 100);
                } else {
                    budgetData.incomeSpentPercentage = -1 // assign anomaly case value i.e -1
                }
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
        addButton: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        budgetValue: ".budget__value",
        budgetIncomeValue: ".budget__income--value",
        budgetExpensesValue: ".budget__expenses--value",
        budgetIncomePercentage: ".budget__expenses--percentage",
        container: ".container"
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstring.addDescription).value,
                value: parseFloat(document.querySelector(DOMstring.addValue).value) //convert string to number for further calculations
            };
        },
        updateBudgetInfo: function (budgetObj) {
            document.querySelector(DOMstring.budgetValue).textContent = budgetObj.budget;
            document.querySelector(DOMstring.budgetExpensesValue).textContent = budgetObj.totalExpenses;
            document.querySelector(DOMstring.budgetIncomeValue).textContent = budgetObj.totalIncome;
            if (budgetObj.incomeSpentPercentage > 0) {
                document.querySelector(DOMstring.budgetIncomePercentage).textContent = budgetObj.incomeSpentPercentage + " %";
            } else {
                document.querySelector(DOMstring.budgetIncomePercentage).textContent = "---";
            }
        },
        addListItem: function (obj, type) {
            //create HTML string with placeholder text
            let html, newHtml, DOMlistContainer;
            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstring.incomeList;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstring.expenseList;
            }
            //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //insert the html into DOM use insert adjacent html
            document.querySelector(DOMlistContainer).insertAdjacentHTML("beforeend", newHtml);
        },
        clearFields: function () {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstring.addDescription + ',' + DOMstring.addValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        deleteItem: function (type, id) {

        }
        ,
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
        document.querySelector(DOMstrings.container).addEventListener('click', crlDeleteItem);
    };

    let crlDeleteItem = function (event) {
        let itemID, splitID, type , id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversing from delete icon to the div of the whole individual item
        if (itemID) {
            //split the id e.g. inc-6 to inc and 6 to call deletion functions for data and UI
            splitID = itemID.split('-');
            type=splitID[0];
            id= parseInt(splitID[1]);
            //1. delete thew item from the datastructure
            budgetCrl.deleteItem(type,id);
            //2. delete the item from the UI
            UICrl.deleteItem(type,id);
            //3. Update the budget
            crlUpdateBudget();
        }
    };

    let crlUpdateBudget = function () {
        let budget;
        // 1. calculate the overall budget
        budgetCrl.calculateBudget();
        // 2. return budget
        budget = budgetCrl.getbudget();
        // 3. display the overall budget on UI
        UICrl.updateBudgetInfo(budget);
    };

    let crlAddItem = function () {
        let input, newItem;
        // 1. get the field input data
        input = UICrl.getInput();
        // 1.1 input validation
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the appropriate data structure as income or expense through budget controller
            newItem = budgetCrl.addItems(input.type, input.description, input.value);
            // 3. add the item to the UI list of expenses or income items based on the type of item
            UICrl.addListItem(newItem, input.type);
            // 4. clear the fields
            UICrl.clearFields();
            // 5. calculate and update budget
            crlUpdateBudget();
        }
    };

    return {
        init: function () {
            console.log("The Application has started");
            UICrl.updateBudgetInfo({budget: 0, totalIncome: 0, totalExpenses: 0, incomeSpentPercentage: -1});
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();