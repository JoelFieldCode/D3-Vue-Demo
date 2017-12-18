new Vue({

  el: "#todos",

  data: function(){
    return {
    }
  },

  filters: {

  },

  computed: {

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
