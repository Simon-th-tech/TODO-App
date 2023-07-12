var $ = Dom7;

var device = Framework7.getDevice();
var app = new Framework7({
  name: 'TodoList_App', // App name
  theme: 'auto', // Automatic theme detection
  colors: {
    primary: '#ff0000',
  },

  el: '#app', // App root element

  // App store
  store: store,
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova,
    scrollIntoViewCentered: device.cordova,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
        
      }
    },
  },
});



// Login Screen Demo
// $('#my-login-screen .login-button').on('click', function () {
  // var username = $('#my-login-screen [name="username"]').val();
  // var password = $('#my-login-screen [name="password"]').val();
  // var email = $('#my-login-screen [name="email"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username, email and password
  // app.dialog.alert('Username: ' + username + '<br/>Password: ' + password + '<br/>Email:' + email);


// })


// data-lists.addEventListener('submit', e =>{
//   e.preventDefault
// })



$('#add-task-btn').on('click', function () {
  console.log('Add taskeeee');


});
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-task-button]')


const Local_STORAGE_LIST_KEY = 'task.lists'
const Local_STORAGE_SELECTED_LIST_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(Local_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem
( Local_STORAGE_SELECTED_LIST_KEY)

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e =>{
  if(e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === 
      e.target.id )
      selectedTask.complete = e.target.checked
      save()
      renderTaskCount(selectedList)
  }
} 
)

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

listsContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

newListForm.addEventListener('submit', e =>{
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})


newTaskForm.addEventListener('submit', e =>{
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId )
  selectedList.tasks .push(task)
  saveAndRender()
})

function createList(name){
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name){
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender(){
  save()
  render()
}

function save(){
  localStorage.setItem(Local_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(Local_STORAGE_SELECTED_LIST_KEY, selectedListId)
}

function render(){
  clearElement(listsContainer)
  renderList()
  const selectedList = lists.find(list => list.id === selectedListId)
  if(selectedListId == null){
    listDisplayContainer.style.display = 'none'

  }else{
    listDisplayContainer.style.display =  ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList){
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id 
    label.append(task.name)
    tasksContainer.appendChild(taskElement)

  })
}

function renderTaskCount(selectedList){
  const incompleteTasksCount = selectedList.tasks.filter(task => 
    !task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTasksCount} ${taskString}
    remaining`
}

function renderList(){
  lists.forEach(list =>{
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if(list.id === selectedListId) listElement.classList.add
    ('active-list')
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
  }

}
render()




