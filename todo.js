$(document).ready(function () {

    let page = 1;
    let mainArr = [];
    let currentTab = `showAll`;
    let completedTodo = [];

    const element = function (text) {
        return {
            id: Math.random(),
            textArea: text,
            condition: false
        }
    }

    const addToArr = function (text) {
        if (!text.trim())return;
        text = validation(text);
        mainArr.push(element(text));
        if (currentTab == `showCompleted`){
            currentTab = `showAll`;
            $("#showCompleted").removeClass("active");
            $("#showAll").addClass("active");
        }
        renderActiveTab();
    }

    const render = function(arr){
        $('.list-group').empty();
        let filteredForPages = pagination(arr);
        if (filteredForPages.length === 0) {
          page--;
          filteredForPages = pagination(arr);
        }
        let value = filteredForPages.reduce(function(previousValue, item) {
            return previousValue + 
            `<li class="list-group-item d-flex justify-content-center" id="${item.id}">
                <input type = "checkbox" class="check-todo custom-control-input" ${item.condition ? 'checked' : ''}>
                <label class="custom-control-label"></label>
                <span class="span-input"> ${item.textArea}</span> 
                <a href="#" class="list-group-item delete-element">
                         <i class="material-icons d-flex justify-content-end">delete</i>
                </a>
            </li>`
        },"");
        $("#tasksList").html(value);
        setCheckboxCondition();
        countTodo();
    }

    const pagination = function(arr){
        $('.pagination').empty();
        const numbersPage = Math.ceil(arr.length / 5);
        if (page === 0) {
          page++;
        }
          const pagesMore1 = 2;
        if (numbersPage >= pagesMore1) {
          for (let idPage = 1; idPage <= numbersPage; ++idPage) {
            let classPage = '';
            if (idPage === Number(page)) {
              classPage = 'active';
            }
            $('.pagination').append(String(`<li class="page-item ${classPage}" id='${idPage}'><a class="page-link">${idPage}</a></li>`))
            }
        }
        let firstTodoOnPage = page * 5;
        firstTodoOnPage -= 5;
        const lastTodoOnPage = firstTodoOnPage + 5;
        return arr.slice(firstTodoOnPage, lastTodoOnPage);
    };

    const changePage = function() {
        page = $(event.target).parent().attr('id');
        renderActiveTab();
    };

    const conditionByClick = function(ID){
        mainArr.forEach((item)=>{
        if (item.id == ID){
            item.condition = !item.condition;
            }
        });
        renderActiveTab();
    }

    const countTodo = function(){
        completedTodo = mainArr.filter(function(item){
            return item.condition == true;
        });
        let uncompletedTodo = mainArr.filter(function(item){
            return item.condition == false;
        });
        $("#todoCompleted").html("completed: " + completedTodo.length);
        $("#todoUncompleted").html("uncompleted: " + uncompletedTodo.length);
    }

    const deleteElementById = function (ID){ 
        mainArr.forEach(function(item, index){
            if (item.id == ID) {
                mainArr.splice(index, 1);
            }
        })
        renderActiveTab();
    }

    const deleteCompleted = function (){
        mainArr.forEach(function(){
                mainArr = mainArr.filter(function(item){
                    return item.condition == false;
                });
        });
        renderActiveTab();
    }

    const getAllTodo = function (){
        render(mainArr);
    }

    const getActiveTodo = function (){
        let mainArrActive = [];
            mainArrActive = mainArr.filter(function(item){
                return item.condition == false;
            });
        render(mainArrActive);
    }

    const getCompletedTodo = function (){
        let mainArrCompleted = [];
            mainArrCompleted = mainArr.filter(function(item){
                return item.condition == true;
            });
       render(mainArrCompleted);
    }

    const renderActiveTab = function(){
        if (currentTab ==`showActive`) getActiveTodo();
        if (currentTab ==`showCompleted`) getCompletedTodo();
        if (currentTab == `showAll`) getAllTodo();
    }

    const validation = function (a){
        a = a.replace(/\&/g, '&amp;')
        a = a.replace(/\</g, '&lt;')
        a = a.replace(/\>/g, '&gt;')
        a = a.replace(/\"/g, '&quot;')
        a = a.replace(/\'/g, '&#x27;')
        a = a.replace(/\//g, '&#x2F;');
         return a;
    }

    const editElement = function (ID, text){
        if (!text.trim())return;
            mainArr.forEach(function(item){
                if (item.id == ID){
                    item.textArea = text;
                }
            })
            renderActiveTab();
    }

    const checkAll = function () {
        if (completedTodo.length == mainArr.length){
            mainArr.forEach(function(item){
                item.condition = false;
            });
        }
        else{
        mainArr.forEach(function(item){
                if (item.condition == false) {
                    item.condition = true;
                };
            })
        }
        renderActiveTab();
    }

    const setCheckboxCondition = function(){
        if(completedTodo.length != mainArr.length){
            $('.block-one-line').prop(`checked`, false);
        }
    }

    $(document).on('click', '.delete-element', function () {
        const ID = parseFloat($(this).parent().attr("id"));
        deleteElementById(ID);
    })

    $(document).on('keypress', '#tasksInput', function (event) {
        if (event.which === 13) {
            addToArr(this.value);
            this.value = "";
        }
    })

    $(document).on('dblclick', '.span-input', function () {
        const input = $(`<input type="text" class="edit-input" value="${$(this).text()}">`);
        $(this).parent().html(input);
        input.focus();
    })

    $(document).on('click', '#deleteCompleted', function () {
        deleteCompleted();
    })

    $(document).on('click', '#checkAll', function () {
        checkAll(completedTodo);
    })

    $(document).on('change', '.check-todo', function () {
        let ID = $(this).parent().attr(`id`);
        conditionByClick(ID);
    })

    $(document).on('click', '#showAll', function () {
        getAllTodo();
    })

    $(document).on('click', '#showActive', function () {
        getActiveTodo();
    })

    $(document).on('click', '#showCompleted', function () {
        getCompletedTodo();
    })
    
    $(document).on('click', '.btn-tab', function () {
        $(".btn-tab").removeClass("active");
        $(this).addClass("active");
    })

    $(`.btn-tab`).on(`click`, function(){
        currentTab = $(this).attr(`id`);
        renderActiveTab();
       }) 

    $('.pagination').on('click', '.page-item', changePage);

    $(document).on('keypress', '.edit-input', function (event){
        if (event.which === 13) {
            const ID =  parseFloat($(this).parent().attr("id"));
            editElement(ID, this.value);
        }
    })
    $(document).on('blur','.edit-input', renderActiveTab);
});