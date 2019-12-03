// Used IFFE (immediately invoked function expression) to store a private variables
// to create data privacy by creating a new scope
// Description:
// After execution of each outer function the closures are created to which only the
// interfaces have access thus creating data encapsulation for the inner functionality and private data
// variables of each controller
let budgetController = (function(){

})();

let UIController = (function(){

})();

// connect Ui controller and budget controller
let controller = (function(budgetCrl, UICrl){

})(budgetController,UIController);