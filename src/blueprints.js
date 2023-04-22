import { format } from 'date-fns';
import flatpickr from 'flatpickr';

export class Overlay{
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


export class Projects{
    
    constructor(){
        this.listContainer = document.querySelector('.projects-list');
        this.listItem = document.querySelector('.project');
        this.newProjectBtn = document.querySelector('.show-new-project-container');
        this.newProjectContainer = document.querySelector('.new-project');
        this.addProjectBtn = document.querySelector('#add-project');
        this.cancelEntry = document.querySelector('#cancel-entry');
        this.input = document.querySelector('#project-name');
        this.deleteProject= document.querySelector('.delete-project');
        
        this.newProjectBtn.addEventListener('click', this.show_NewProjectContainer.bind(this));
        this.cancelEntry.addEventListener('click', this.hide_NewProjectContainer.bind(this));
        this.listContainer.addEventListener('click', this.deleteExistingProject.bind(this));
        this.addProjectBtn.addEventListener('click', this.addProjectToProjectMenu.bind(this))
    }
    
    show_NewProjectContainer(){
        this.newProjectContainer.style.transform= 'scale(1)';
    }
    
    hide_NewProjectContainer(){
        this.newProjectContainer.style.transform= 'scale(0)';
        this.input.value= '';
    }
    
    deleteExistingProject(e){
        if (e.target.classList.contains('delete-project')) {
            const Item = e.target.parentNode;
            this.listContainer.removeChild(Item);
        }
    }
    
    createProjectElement(value){
        const li= document.createElement('li');
        li.textContent= value;
        li.classList.add('project');
        
        const img = document.createElement('img');
        img.classList.add('delete-project');
        img.src = '../assets/delete-transparent.svg';
        img.alt = 's';
        li.appendChild(img);
        
        return li;
    }
    
    
    addProjectToProjectMenu(){
        if(this.input.value === '') return;
        
        const listItem= this.createProjectElement(this.input.value)
        
        this.listContainer.appendChild(listItem);
        
        this.hide_NewProjectContainer()
    }
    
    
    
    
}



export class TodoCard {
    
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
        
        
        this.detailsBtn.addEventListener('click', this.show_detailsContainer.bind(this))
    }
    
    
    makeTodoCard(){
        
        this.todoContainer.classList.add('todo-container');
        
        this.todo.classList.add('todo');
        
        this.rightElements.classList.add('right-elements');
        
        this.detailsBtn.textContent= 'Details';
        
        this.dateShown.classList.add('date-shown');
        
        this.deleteTodo.src= '../assets/delete.svg';
        this.deleteTodo.alt= 'delete button';

        this.todoCard_customization()
        
        this.rightElements.append(this.detailsBtn, this.dateShown, this.deleteTodo);
        this.todo.append(this.todoTitle, this.rightElements);
        this.todoContainer.append(this.todo);
        this.rightContainer.appendChild(this.todoContainer);
        
    }
    
    todoCard_customization(){
        this.todoTitle.textContent= this.title;
        this.detailsContainerTitle.textContent= this.title;
        this.detailsContainerContent.textContent= this.details;
        this.dateShown.textContent= format(new Date(this.date), 'MM/dd/yyyy')
        
        
        if(this.priority === 'red'){
            this.todo.classList.add('red');
        }
        
        if(this.priority === 'yellow'){
            this.todo.classList.add('yellow');
        }
        
        if(this.priority === 'green'){
            this.todo.classList.add('green');
        }
        
    }
    
    show_detailsContainer(){
        this.overlay.activateOverlay();
        this.detailsContainer.classList.add('active');
    }
    
}


export class ManageTasks{
    constructor(){
        this.newTask_Btn= document.querySelector('.add-task-btn');
        this.TaskForm= document.querySelector('.new-task');
        this.inputTitle= document.querySelector('.todo-title');
        this.inputDescription= document.querySelector('.todo-description');
        this.selectedPriority= document.querySelector('input[name="priority"]');
        this.inputDate= document.querySelector('.todo-date');
        this.submitBtn= document.querySelector('.submit-btn');
        
        this.overlay = new Overlay();
        this.todo= new TodoCard()
        
        this.newTask_Btn.addEventListener('click', this.show_taskFrom.bind(this));
        this.submitBtn.addEventListener('click', this.submitForm.bind(this));
    }

    show_taskFrom(){
        this.overlay.activateOverlay();
        this.TaskForm.classList.add('active');
        this.resetInputs()

    }

    submitForm(e){
        e.preventDefault();
        if(this.inputTitle.value === '' || this.inputDescription.value === '' || this.inputDate.value === '') return
        this.selectedPriority= document.querySelector('input[name="priority"]:checked');
        this.todoDeployment= new TodoCard(this.inputTitle.value, this.inputDescription.value, this.inputDate.value, this.selectedPriority.value);
        this.todoDeployment.makeTodoCard();
        console.log(this.selectedPriority.value);
        this.overlay.removeOverlay();
        this.resetInputs();
    }

    resetInputs(){
        this.inputTitle.value='';
        this.inputDescription.value= '';
        this.inputDate.value= '';
        this.selectedPriority.value= 'auto';
    }

}






















