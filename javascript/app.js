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
            this.description = description ? description : 'income-'+id;
            this.value = value ? value : 0;
        };
        //function constructor of expense object
        let Expense = function (id, description, value) {
            this.id = id;
            this.description = description ? description : 'income-'+id;
            this.value =  value ? value : 0;
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
            expensePercentage: 0,
            overallBudget: 0,
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
        expenseList: ".expenses__list"
    };
    return {
        getInput: function () {
                return {
                    type: document.querySelector(DOMstring.inputType).value, // will be either inc or exp
                    description: document.querySelector(DOMstring.addDescription).value,
                    value: document.querySelector(DOMstring.addValue).value
                };
        },
        addListItem: function (obj, type) {
            //create HTML string with placeholder text
            let html, newHtml, DOMlistContainer;
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstring.incomeList;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                DOMlistContainer = DOMstring.expenseList;
            }
            //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //insert the html into DOM use insert adjacent html
            document.querySelector(DOMlistContainer).insertAdjacentHTML("beforeend", newHtml)

        },
        clearFields: function () {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstring.addDescription + ',' + DOMstring.addValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value="";
            });
            fieldsArray[0].focus();
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
    };
    let crlAddItem = function () {
        let input, newItem;
        // 1. get the field input data
        input = UICrl.getInput();
            // 2. add the item to the appropriate data structure as income or expense through budget controller
            newItem = budgetCrl.addItems(input.type, input.description, input.value);
            // 3. add the item to the UI list of expenses or income items based on the type of item
            UICrl.addListItem(newItem, input.type);
            //4. clear the fields
            UICrl.clearFields();
            // 5. calculate the overall budget

            // 6. display the overall budget on UI
    };

    return {
        init: function () {
            console.log("The Application has started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();