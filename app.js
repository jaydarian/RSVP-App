document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrar');
    const input = form.querySelector('input');
    const mainDiv = document.querySelector('.main');
    const ul = document.getElementById('invitedList');
    var stringOfRemovedNames = [];
    
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckbox = document.createElement('input');
    
    console.log("We are storing invitees and removed invitees in local storage!");
    
    filterLabel.textContent = "Hide those who haven't responded";
    filterCheckbox.type = 'checkbox';
    div.appendChild(filterLabel);
    filterLabel.appendChild(filterCheckbox);
    mainDiv.insertBefore(div, ul);
    filterCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const lis = ul.children;
        if (isChecked) {
            for (let i = 0; i < lis.length; i += 1) {
                let li = lis[i];
                if (li.className === 'responded') {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            }
        } else {
            for (let i = 0; i < lis.length; i += 1) {
                let li = lis[i];
                li.style.display = '';
            }
        }
    });
    // LOCAL STORAGE
    function supportsLocalStorage() {
        try{
          return 'localStorage' in window && window['localStorage'] !== null;  
        } catch(e) {
          return false;
        }
      }
      
      function getInvitees() {
        var invitees = localStorage.getItem('invitees');
        if(invitees) {
          return JSON.parse(invitees);
        } else { // Make a new string
          return [];
        }
      }
      // rename to updateInviteString 
      function saveInviteeString(str) {
        var invitees = getInvitees();
        if(!str || invitees.indexOf(str) > -1) {
          return false;
        }

        invitees.push(str);
        localStorage.setItem('invitees', JSON.stringify(invitees));
        return true;
      }

      function getRemovedInvitees() {
        var removedInvitees = localStorage.getItem('removedInvitees');;
        if(removedInvitees) {
            return JSON.parse(removedInvitees);
          } else { // Make a new string
            return [];
          }
      }

      function saveInviteeRemovalList(str) {
        var removedInvitees = getRemovedInvitees();
        if(!str || stringOfRemovedNames.indexOf(str) > -1) {
            return false;
          }
        stringOfRemovedNames.push(str);
        removedInvitees.push(str);
        localStorage.setItem('removedInvitees', JSON.stringify(removedInvitees));
        return true;
      }

    // creating the li node
    function createLI(text) {
        const li = document.createElement('li');
        function createElement(elementName, property, value) {
            const element = document.createElement(elementName);
            element[property] = value;
            return element;
        }
        function appendToLI(elementName, property, value) {
            const element = createElement(elementName, property, value);
            li.appendChild(element);
            return element;
        }
        appendToLI('span', 'textContent', text);
        appendToLI('label', 'textContent', 'Confirmed').appendChild(createElement('input', 'type', 'checkbox'));
        appendToLI('button', 'textContent', 'edit');
        appendToLI('button', 'textContent', 'remove');
        return li;
    }

    
    if (supportsLocalStorage()) {
        // Initialize display list with the invitees array
        var invitees = getInvitees();
        var removedInvitees = getRemovedInvitees();
        invitees.forEach( (inviteeString) => {
            if (removedInvitees.indexOf(inviteeString) > -1) {
               return false
            } else {
                const li = createLI(inviteeString);
                ul.appendChild(li);
            }
           
        });
  
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value;
            input.value = '';
            if (saveInviteeString(text)) {
                const li = createLI(text);
                ul.appendChild(li);
            }   
            
        });

        ul.addEventListener('change', (e) => {
            const checkbox = e.target;
            const checked = checkbox.checked; //checked is a boolean attribute
            const listItem = checkbox.parentNode.parentNode;
            if (checked) {
                listItem.className = 'responded';
            } else {
                listItem.className = '';
            }
        });

        ul.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const button = e.target;
                const li = e.target.parentNode;
                const ul = li.parentNode;
                const action = button.textContent;
                const nameActions = { 
                    remove: () =>  {
                        const span = li.firstElementChild;
                        saveInviteeRemovalList(span.textContent)
                        ul.removeChild(li);
                    },
                    edit: () => {
                        const span = li.firstElementChild;
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = span.textContent; 
                        li.insertBefore(input, span);
                        li.removeChild(span);
                        button.textContent = 'save';
                    },
                    save: () => {
                        const input = li.firstElementChild;
                        const span = document.createElement('span');
                        span.textContent = input.value;
                        li.insertBefore(span, input); 
                        li.removeChild(input);
                        button.textContent = 'edit';
                    }
                }
                // select and run action in button's name
                nameActions[action]();
               
            }
        });
    }
});