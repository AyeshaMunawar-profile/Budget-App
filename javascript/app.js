// Used IFFE (immediately invoked function expression) to store a private variables
// to create data privacy by creating a new scope
// Description:
// After execution of each outer function the closures are created to which only the
// interfaces have access thus creating data encapsulation for the inner functionality and private data
// variables of each controller
//BUDGET CONTROLLER
const INC = "inc";
const EXP = "exp";

let budgetController = (function () {
        //function constructor for income object
        let Income = function (id, description, value) {
            this.id = id;
            this.description = description ? description : 'income-' + id;
            this.value = value ? value : 0;
        };
        //function constructor of expense object
        let Expense = function (id, description, value, percentage) {
            this.id = id;
            this.description = description ? description : 'income-' + id;
            this.value = value ? value : 0;
            this.percentage = percentage ? percentage : -1;
        };

        Expense.prototype.calculatePercentage = function (totalIncome) {
            let percentage;
            if (totalIncome > 0) {
                percentage = Math.round((this.value / totalIncome) * 100);
                this.percentage = percentage;
            } else {
                this.percentage = -1;
            }
        };

        Expense.prototype.getPercentage = function () {
            return this.percentage;
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
                if (type === EXP) {
                    newItem = new Expense(ID, des, val);

                } else if (type === INC) {
                    newItem = new Income(ID, des, val);
                }
                // add new item to the respective data structure based on type i.e exp or inc
                budgetData.allItems[type].push(newItem);
                return newItem;
            },
            deleteItem: function (type, id) {
                let idArray, index;
                idArray = budgetData.allItems[type].map(function (current) {
                    return current.id;
                });
                index = idArray.indexOf(id); // find index of the element with this id
                if (index !== -1) {
                    budgetData.allItems[type].splice(index, 1); // delete at index 1 array element
                    budgetData.itemsCount--;
                }
            },

            getbudget: function () {
                return {
                    budget: budgetData.budget,
                    totalIncome: budgetData.totalItems.inc,
                    totalExpenses: budgetData.totalItems.exp,
                    incomeSpentPercentage: budgetData.incomeSpentPercentage
                };
            },
            getIncomeSpentPercentages: function () {
                let percentagesArray;
                percentagesArray = budgetData.allItems.exp.map(function (current) {
                    return current.getPercentage();
                });
                return percentagesArray;
            },
            calculateBudget: function () {
                //1. calculate total income and expense
                calculateTotal(INC);
                calculateTotal(EXP);
                //2. calculate total budget: income -expense
                budgetData.budget = budgetData.totalItems.inc - budgetData.totalItems.exp;
                //3. calculate the total percentage of income that we spent (only calculate it if income is > 0)
                if (budgetData.totalItems.inc > 0) {
                    budgetData.incomeSpentPercentage = Math.round((budgetData.totalItems.exp / budgetData.totalItems.inc) * 100);
                } else {
                    budgetData.incomeSpentPercentage = -1 // assign anomaly case value i.e -1
                }
            },
            calculateIncomePercentages: function () {
                let totalIncome;
                totalIncome = budgetData.totalItems.inc;
                budgetData.allItems.exp.forEach(function (current) {
                    current.calculatePercentage(totalIncome);
                });
            },
            testing: function () {
                console.log(budgetData);
            }
        }

    }
)();

//UI CONTROLLER
let UIController = (function () {
    let DOMstrings = {
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
        container: ".container",
        itemExpensePercentage: ".item__percentage",
        budgetTitleMonth: ".budget__title--month",
    };
    let nodeListForEach = function (list, callbackFunction) {
        for (let i = 0; i < list.length; i++) {
            callbackFunction(list[i], i);
        }
    };
    let formatNumber = function (number, type) {
        let numberSplited, intPart, decPart;
        number = Math.abs(number);
        // 1) float numbers with precision of 2 decimal places
        number = number.toFixed(2);
        // 2) add commas separating the thousands
        numberSplited = number.split('.'); // separate the integer and decimal part
        intPart = numberSplited[0];
        decPart = numberSplited[1];
        number = parseInt(intPart);
        intPart = number.toLocaleString();
        number = intPart + "." + decPart;
        // 3) if expense "-" sign and if income "+" sign
        if (type === INC) {
            number = "+ " + number;
        } else if (type === EXP) {
            number = "- " + number;
        }
        return number;
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.addDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.addValue).value) //convert string to number for further calculations
            };
        },
        updateBudgetInfo: function (budgetObj) {
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(budgetObj.budget, (budgetObj.budget >= 0 ? (budgetObj.budget == 0 ? "" : INC) : EXP));
            document.querySelector(DOMstrings.budgetExpensesValue).textContent = formatNumber(budgetObj.totalExpenses, EXP);
            document.querySelector(DOMstrings.budgetIncomeValue).textContent = formatNumber(budgetObj.totalIncome, INC);
            if (budgetObj.incomeSpentPercentage > 0) {
                document.querySelector(DOMstrings.budgetIncomePercentage).textContent = budgetObj.incomeSpentPercentage + " %";
            } else {
                document.querySelector(DOMstrings.budgetIncomePercentage).textContent = "---";
            }
        },
        addListItem: function (obj, type) {
            //create HTML string with placeholder text
            let html, newHtml, DOMlistContainer;
            if (type === INC) {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstrings.incomeList;
            } else if (type === EXP) {
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstrings.expenseList;
            }
            //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            //insert the html into DOM use insert adjacent html
            document.querySelector(DOMlistContainer).insertAdjacentHTML("beforeend", newHtml);
        },
        clearFields: function () {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.addDescription + ',' + DOMstrings.addValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        deleteItem: function (selectorID) {
            let item;
            item = document.getElementById(selectorID);
            item.parentNode.removeChild(item);
        }
        ,
        displayPercentages: function (percentages) {
            let percentageElementsList;
            percentageElementsList = document.querySelectorAll(DOMstrings.itemExpensePercentage);
            nodeListForEach(percentageElementsList, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + " %";
                } else {
                    current.textContent = "---";
                }
            });
        }
        ,
        displayDate: function () {
            let now, year, month, dateTitle, months;
            months = ["January", " February", " March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            now = now.getDay();
            dateTitle = document.querySelector(DOMstrings.budgetTitleMonth);
            dateTitle.textContent = (now > 3 ? now + "th " : (now === 1 ? now + "st " : (now === 2 ? now + "nd " : (now === 3 ? now + "rd " : now + "th ")))) + months[month] + " " + year;
        },
        changeInputBorder: function () {
            let fields;
            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.addDescription + ',' +
                DOMstrings.addValue
            );
            nodeListForEach(fields, function (current) {
                current.classList.toggle("red-focus");
            });
            document.querySelector(DOMstrings.addButton).classList.toggle('red');
        },
        getDOMStrings: function () {
            return DOMstrings;
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
        document.querySelector(DOMstrings.inputType).addEventListener('change', changeType);
    };

    let crlDeleteItem = function (event) {
        let itemID, splitID, type, id, index;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversing from delete icon to the div of the whole individual item
        if (itemID) {
            //split the id e.g. inc-6 to inc and 6 to call deletion functions for data and UI
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            //1. delete thew item from the datastructure
            budgetCrl.deleteItem(type, id);
            //2. delete the item from the UI
            UICrl.deleteItem(itemID);
            //3. Update the budget
            crlUpdateBudget();
            //4. Calculate and update the income spent percentages of each expense entry
            updateIncomeSpentPercentages();
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

    let updateIncomeSpentPercentages = function () {
        let incomePercentagesArray;
        //1. calculate the income spent percentage for each of the expense
        budgetCrl.calculateIncomePercentages();
        //2. read the percentages from the budget Controller
        incomePercentagesArray = budgetCrl.getIncomeSpentPercentages();
        //3. update the UI for income spent percentage for each expense entry
        UICrl.displayPercentages(incomePercentagesArray);
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
            // 6. calculate and update the income spent percentages of each expense entry
            updateIncomeSpentPercentages();
        }

    };
    let changeType = function (change) {
        UICrl.changeInputBorder();
    }
    return {
        init: function () {
            console.log("The Application has started");
            UICrl.updateBudgetInfo({budget: 0, totalIncome: 0, totalExpenses: 0, incomeSpentPercentage: -1});
            UICrl.displayDate();
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();