new Vue({

  el: "#comments",

  data: function(){
    return {
      todos: [],
      showTodos: false,
      //boolean sort order that can be toggled
      sortOrder: 1,
    }
  },

  filters: {

    // sort by completed todos, with a sort order that can be toggled
    sortByCompleted: function(users){

      return users.slice().sort(function(userA,userB){
        return (this.sortOrder === -1 ? userA.values.completedItems - userB.values.completedItems : userB.values.completedItems - userA.values.completedItems);
      }.bind(this));

    }

  },

  computed: {

    sortDirection: function(){
      return (this.sortOrder === -1 ? "least" : "most");
    },

    // determine the most amount of todos per person that haven't been completed
    mostAmountOfTodosUnCompleted: function(){
      return d3.max(this.users, function(user){
        return user.values.unCompletedItems;
      });
    },

    // determine the most amount of todos per person that have been completed
    mostAmountOfTodosCompleted: function(){
      return d3.max(this.users, function(user){
        return user.values.completedItems;
      });
    },

    // determine the least amount of todos per person that haven't been completed
    leastAmountOfTodosUnCompleted: function(){
      return d3.min(this.users, function(user){
        return user.values.unCompletedItems;
      });
    },

    // determine the least amount of todos per person that have been completed
    leastAmountOfTodosCompleted: function(){
      return d3.min(this.users, function(user){
        return user.values.completedItems;
      });
    },

    //group the todos by user id so we can find all the todos by each user
    users: function(){

      return d3.nest()
         // group by unique user id
        .key(function(d){
          return d.userId;
        })
        // our calculations for each users todos
        .rollup(function(thisUserTodos){
          var values = {};

          // sum up the completed thisUserTodos by diving into the thisUserTodos and returning 1 for a completed todo and 0 for a uncompleted todo
          values.completedItems = d3.sum(thisUserTodos, function(todo){
            if(todo.completed){
              return 1;
            }
            return 0;
          });

          // sum up the uncompleted thisUserTodos by diving into the thisUserTodos and returning 0 for a completed todo and 1 for a uncompleted todo
          values.unCompletedItems = d3.sum(thisUserTodos, function(todo){
            if(todo.completed){
              return 0;
            }
            return 1;
          });

          // grab this users id
          values.userId = thisUserTodos[0].userId;

          return values;
        })
        .entries(this.todos);

    }

  },

  ready: function(){

    // get dummy todos
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/todos",
      method: 'GET'
    }).then(function(todos) {
      this.todos = todos;
    }.bind(this));

  }

});
