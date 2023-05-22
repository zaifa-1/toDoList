import { format, differenceInDays } from 'date-fns';
import flatpickr from 'flatpickr';

export class Overlay{  //active and deactivate the overlay
    constructor(){
        this.overlay= document.querySelector('.overlay');
        this.overlay.addEventListener('click', this.removeOverlay.bind(this))
    }

    removeOverlay(){
        const elements = document.querySelectorAll('.active');
        elements.forEach(element => {
            element.classList.remove('active');
        });
    
    }

    activateOverlay(){
        this.overlay.classList.add('active');
    }
}

    let storageUnit= {}; //store all the projects inside this
    storageUnit['Today']=[]

    let selectedProject; // the project that needs to be modified
    let saveToLocalStorage= JSON.stringify(storageUnit); //save the project to local storage (converts object to a string)
    let getFromLocalStorage= JSON.parse(localStorage.getItem("savedData"));; //retrieve data from local storage to initialize the page

    
    
    export function onPageLoad(){

        if (getFromLocalStorage) {
        storageUnit = getFromLocalStorage;
        const newListItem= new Projects()
        for(let box in storageUnit){
            if(box !== 'Today'){
                newListItem.createProjectElement(box)
            }
        }
        console.log(storageUnit)
        } 
    }
         
        
export class Projects{ //manage all the projects, the elements on the left side
    
    constructor(){
        this.today = document.querySelector('.today')
        this.listContainer = document.querySelector('.projects-list');
        this.projectName = document.querySelector('.project-name');
        this.listItem = document.querySelector('.project');
        this.newProjectBtn = document.querySelector('.show-new-project-container');
        this.newProjectContainer = document.querySelector('.new-project');
        this.addProjectBtn = document.querySelector('#add-project');
        this.cancelEntry = document.querySelector('#cancel-entry');
        this.input = document.querySelector('#project-name');
        this.deleteProject= document.querySelector('.delete-project');

        this.todoElements= new TodoCard()
        
        this.newProjectBtn.addEventListener('click', this.show_NewProjectContainer.bind(this));
        this.cancelEntry.addEventListener('click', this.hide_NewProjectContainer.bind(this));
        this.addProjectBtn.addEventListener('click', this.addProjectToProjectMenu.bind(this));
        this.today.addEventListener('click', this.handleProjectClick.bind(this));
    }

    removePreviousTasks(){
        for(let a in storageUnit['Today']){
            let validity= storageUnit['Today'][a].date
            let b= format(new Date(), 'MM/dd/yyyy');
            let c= format(new Date(validity), 'MM/dd/yyyy')
            if(b !== c){
                storageUnit['Today'].splice(a,1);
            }
        }
    }

    manageTodaysTasks(){
        this.removePreviousTasks()
        for(let box in storageUnit){
            const todo= storageUnit[box];
            for(let i=0; i< todo.length; i++){
                let a= format(new Date(), 'MM/dd/yyyy')
                let b= format(new Date(todo[i].date), 'MM/dd/yyyy')
                if(!(storageUnit['Today'].some(item => item.title === todo[i].title))){
                    if(a === b){
                        storageUnit['Today'].push(todo[i]);
                    }
                }
            }
        }
    }

    handleProjectClick(e){
        this.todoElements.clearAllTodo()
        selectedProject= storageUnit[e.target.textContent];
        this.projectName.textContent= e.target.textContent;
        this.todoElements.loadNewTodo();
    }

    deleteClickedProject(e){
        const Item = e.target.parentNode;
        const projectName = Item.textContent;
        delete storageUnit[projectName];
        this.listContainer.removeChild(Item);

        saveToLocalStorage= JSON.stringify(storageUnit);
        localStorage.setItem("savedData", saveToLocalStorage);
        
    }

    addProjectToProjectMenu(){
        if(this.input.value === '' || storageUnit.hasOwnProperty(this.input.value)) return;

        let storageBox=[]

        storageUnit[this.input.value]= storageBox;
        
        this.createProjectElement(this.input.value)

        selectedProject= storageUnit[this.input.value];
        this.projectName.textContent= this.input.value;
        
        this.todoElements.clearAllTodo()
        this.hide_NewProjectContainer();

        saveToLocalStorage= JSON.stringify(storageUnit);
        localStorage.setItem("savedData", saveToLocalStorage);


    }
    
    createProjectElement(value){
        const li= document.createElement('li');
        li.textContent= value;
        li.classList.add('project');
        li.addEventListener('click', this.handleProjectClick.bind(this))
        
        const img = document.createElement('img');
        img.classList.add('delete-project');
        img.src = '../assets/x-symbol-svgrepo-com.svg';
        img.alt = 's';
        li.appendChild(img);

        img.addEventListener('click', this.deleteClickedProject.bind(this));
        
        this.listContainer.appendChild(li);
    }

    show_NewProjectContainer(){
        this.newProjectContainer.style.transform= 'scale(1)';
    }
    
    hide_NewProjectContainer(){
        this.newProjectContainer.style.transform= 'scale(0)';
        this.input.value= '';
    }
    

        
}



export class TodoCard {  //make a card that has some info in it

    constructor(title, details, date, priority){
        this.title = title;
        this.details = details;
        this.date = date;
        this.priority = priority;
        
        this.todoContainer= document.createElement('div');
        this.todo= document.createElement('div');
        this.todoTitle= document.createElement('p');
        this.rightElements= document.createElement('div');
        this.detailsBtn= document.createElement('button');
        this.dateShown= document.createElement('div');
        this.deleteTodo= document.createElement('img');
        
        this.rightContainer= document.querySelector('.right');
        this.detailsContainer= document.querySelector('.details-container');
        this.detailsContainerTitle= document.querySelector('.details-container h2');
        this.detailsContainerContent= document.querySelector('.details-container p');
        
        this.overlay = new Overlay();
        
        this.deleteTodo.addEventListener('click', this.deleteSelectedTodo.bind(this))
        this.detailsBtn.addEventListener('click', this.show_detailsContainer.bind(this))
    }

    clearAllTodo(){ //remove all existing cards in the body
        let deletableTodo= document.querySelectorAll('.todo-container')
        deletableTodo.forEach(card => {
            card.remove()
        })
    }

    loadNewTodo(){
        for(let i in selectedProject){
            const todo = selectedProject[i];
            const newTodoCard = new TodoCard(todo.title, todo.details, todo.date, todo.priority);
            newTodoCard.makeTodoCard();
        }
    }

    deleteSelectedTodo(e){
        const selectedTodo = e.target.parentNode.parentNode.parentNode; // first parent-node is the 'right-elements' container, then todo, then todoContainer
        const todoContainer = selectedTodo.parentNode; // get the parent of selectedTodo (the whole right container)

        todoContainer.removeChild(selectedTodo); // remove the selected card

        for(let box in storageUnit){
            const todo= storageUnit[box];
            for(let i=0; i<todo.length; i++){
                if(todo[i].title === this.todoTitle.textContent ){
                    todo.splice(i, 1);
                }
            }
        }

        saveToLocalStorage= JSON.stringify(storageUnit);
        localStorage.setItem("savedData", saveToLocalStorage);

    }
    
    
    makeTodoCard(){ //make a new todo card
        
        this.todoContainer.classList.add('todo-container');
        
        this.todo.classList.add('todo');
        
        this.rightElements.classList.add('right-elements');
        
        this.detailsBtn.textContent= 'Details';
        this.detailsBtn.classList.add('details-btn')
        
        this.dateShown.classList.add('date-shown');
        
        this.deleteTodo.src= '../assets/delete.svg';
        this.deleteTodo.alt= 'delete button';
        this.deleteTodo.classList.add('delete-todo')

        this.todoCard_customization()
        
        this.rightElements.append(this.detailsBtn, this.dateShown, this.deleteTodo);
        this.todo.append(this.todoTitle, this.rightElements);
        this.todoContainer.append(this.todo);
        this.rightContainer.appendChild(this.todoContainer);
        
    }
    
    todoCard_customization(){ //insert contents of the todo card
        this.todoTitle.textContent= this.title;
        this.dateShown.textContent= format(new Date(this.date), 'MM/dd/yyyy')
        
        //selecting the color of the card based on its priority
        if(this.priority === 'red'){
            this.todo.classList.add('red');
        }
        
        if(this.priority === 'yellow'){
            this.todo.classList.add('yellow');
        }
        
        if(this.priority === 'green'){
            this.todo.classList.add('green');
        }

        if(this.priority === 'auto'){
            const startDate = new Date();
            const endDate =  new Date(this.date);
            const daysDifference = differenceInDays(endDate, startDate);

            if(daysDifference < 8){
                this.todo.classList.add('red');
                this.priority= 'red'
            }

            if(daysDifference > 7 && daysDifference < 15){
                this.todo.classList.add('yellow');
            }

            if(daysDifference > 14){
                this.todo.classList.add('green');
            }
        }
        
    }
    
    show_detailsContainer(){ //show the details of the todo
        for(let box in selectedProject){
            if(selectedProject[box].title === this.todoTitle.textContent){
                this.detailsContainerTitle.textContent= selectedProject[box].title;
                this.detailsContainerContent.textContent= selectedProject[box].details;
            }
        }
        this.overlay.activateOverlay();
        this.detailsContainer.classList.add('active');
    }
    
}


export class ManageTasks{ // deal with all the deployment of the todo cards and other stuff on the body
    constructor(){
        this.newTask_Btn= document.querySelector('.add-task-btn');
        this.TaskForm= document.querySelector('.new-task');
        this.inputTitle= document.querySelector('.todo-title');
        this.inputDescription= document.querySelector('.todo-description');
        this.errorContent= document.querySelector('.error-content');
        this.projectName = document.querySelector('.project-name');
        this.defaultBtn= document.getElementById('auto');
        
        this.inputDate= document.querySelector('.todo-date');
        flatpickr(this.inputDate);  // change the calender
        flatpickr(this.inputDate, {
            minDate: "today"        //  cannot choose dates before current date
          });

        this.submitBtn= document.querySelector('.submit-btn');
        
        this.overlay = new Overlay();
        this.todo= new TodoCard();
        this.projects= new Projects();

        this.newTask_Btn.addEventListener('click', this.show_taskForm.bind(this));
        this.submitBtn.addEventListener('click', this.submitForm.bind(this));
    }

    show_taskForm(){
        if(this.projectName.textContent === '' || this.projectName.textContent === 'Today' )return
        this.overlay.activateOverlay();
        this.TaskForm.classList.add('active');
        this.resetInputs()

    }

    submitForm(e){
        e.preventDefault();
        if(this.inputTitle.value === '' || this.inputDescription.value === '' || this.inputDate.value === '') return
        if(selectedProject.some(item => item.title === this.inputTitle.value)){
            this.errorContent.textContent= 'A Todo with the same Title already exists';
            return
        }
        this.selectedPriority= document.querySelector('input[name="priority"]:checked');

        this.todoDeployment= new TodoCard(this.inputTitle.value, this.inputDescription.value, this.inputDate.value, this.selectedPriority.value);

        storageUnit[this.projectName.textContent].push(this.todoDeployment);
        this.todoDeployment.makeTodoCard();
        
        this.projects.manageTodaysTasks();

        saveToLocalStorage= JSON.stringify(storageUnit);
        localStorage.setItem("savedData", saveToLocalStorage);


        this.overlay.removeOverlay();
        this.resetInputs();
    }

    resetInputs(){
        this.inputTitle.value='';
        this.inputDescription.value= '';
        this.inputDate.value= '';
        this.errorContent.textContent= ''
        this.defaultBtn.checked= true;
    }

}