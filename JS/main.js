//#region Array varibles

// List of paths to icons
const icons = [
    "SVG/Chat_Icon.png",
    "SVG/Email_Icon.png"
]
// List of given prefixes
const prefixes = ["SYS", "PAR", "ACT"];

//#endregion

//#region Start / fetch Function

// Run when the body of index.html loads
function onStartUp() {
    // These APIs are .json files within my test repo
    // This one is the tree.json provided for the test
    fetch('https://raw.githubusercontent.com/R-s866/Front-end-test/master/JSON/tree.json')
        .then(
            function (response) {
                // Status 200 is all good, anything else will throw this err
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then(function (data) {
                        // Function that contains the test on tree.json file
                        RunTests(data);
                    });
            }
        )
        // Any other errs are caught here
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    // This API i made for this project, a list of dumby messages to display
    fetch('https://raw.githubusercontent.com/R-s866/Front-end-test/master/JSON/messages.json')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then(function (data) {
                        // Function that contains a loop to display all messages in the .json file
                        AddMessage(data);
                    });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

//#endregion

//#region Initicate classes functions 

// Function that handles the test for the tree.json file
function RunTests(data) {
    console.log(Node.flattenArray(data));

    // Input id for the nested element 
    const id = "697eae2f-40dd-445e-a0f0-a918f3a4d5c0";
    console.log(Node.getParentNode(data, id));

    // Using the same id to insert into a nested child
    Node.insertIntoData(data, id);
}

// Loops through messages from messages.json
function AddMessage(data) {
    data.forEach(elem => {
        DomElement.AddDomElement(elem)
    });
}

//#endregion

//#region Add messages to dom

class DomElement {
    // Adds messages to the screen
    static AddDomElement(elem) {
        // Get the Ul element on the dom, to input the messages into in li form
        const mainTable = document.getElementById("main-table");
        // Holds the prefixes for use as a class later
        let pre = null;
        // Returns the prefixe if there is one, or returns null
        // Also the messages string without the prefix
        var getMessage = (s) => {
            var check = s.slice(0, 3);
            if (prefixes.includes(check)) {
                pre = check;
                return s.slice(4);
            } else {
                return s;
            }
        }
        // Returns the approperate icon to use
        var getIcon = (i) => {
            switch (i) {
                case "message":
                    return icons[0];
                case "mail":
                    return icons[1];
            }
        }
        // Gets message to be used
        const message = getMessage(elem.subject);
        // Gets icon to be used
        const icon = getIcon(elem.messageType);

        // Creates a new li, as element.
        // Which will be appended to the ul in thedom
        let element = document.createElement('li');
        // Adds class attribute, so the element will follow my styling
        element.setAttribute('class', 'table-element');
        // Adds prefixe as class to change styling acordingly
        element.classList.add(pre);

        // Adds the innerHTML with all the messages elements appropately placed
        element.innerHTML =
            `<div class="elem1"></div>
            <div class="elem2">${elem.date} <span>${elem.time}</span></div>
            <div class="elem3">
                <small>Subject:</small>
                <span>${message}</span>
            </div>
            <div class="elem4">
                ${elem.firstName} ${elem.secondName} <small>${elem.email}</small>
            </div>
            <div class="elem5">
                ${elem.attachments} <span>Attachments</span>
            </div>
            <div class="elem6">
                <img src=${icon} alt="Email_Icon">
            </div>`;

        // Appends this new message to the ul element in the dom
        mainTable.appendChild(element);
    }
}

//#endregion

//#region Tree Traversal

// Class for node element that come from 
class Node {
    // Finds the give node and adds a node to its children feild
    static insertIntoData(data, str) {
        let result = null;
        // New node to add in
        const newNode = {
            id: 'hello'
        };
        // Recurse function that iterates through all children of a 
        // Node until it find one with the matching id
        var recurse = (r) => {
            r.forEach(elem => {
                if (elem.id === str) {
                    result = elem;
                } else if (elem.children != null) {
                    recurse(elem.children);
                }
            });
        }
        recurse(data);
        // If the node contains the children feild add new node to it
        if (result.children != null) {
            result.children.push(newNode);
        }
        // If the node does not contain children initicate children
        // And add the new node to it
        else {
            result.children = [];
            result.children.push(newNode);
        }
        console.log(result);
    }

    // Finds the parent node of a given id
    static getParentNode(data, str) {
        let result = null;
        // Loops through the data and checks a parent has a child
        data.forEach(parent => {
            if (parent.children != null) {
                var child = parent.children;
                // Loops through each child to check if the id matches
                child.forEach(c => {
                    if (c.id === str) {
                        // If the Id matches returns its parent
                        result = parent;
                    }
                });
            }
        });
        return result;
    }// should have made this recursive too

    // Flattens data uses recursion to itterate through
    // the data and all nested objects within the tree.json file
    static flattenArray(data) {
        let result = [];
        // Recursive function
        var recurse = (cur, prop) => {
            // Returns input if the data object differces from the data 
            if (Object(cur) !== cur) {
                result[prop] = cur;
                // If the data is an array Loop through
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++) {
                    // Run function again with any data inside the array
                    // To check there isnt and more nested arrays
                    recurse(cur[i], prop ? prop + "." + i : "" + i);
                }
                // If there is an empty array return null
                if (l == 0) {
                    result[prop] = null;
                }
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
                if (isEmpty) {
                    result[prop] = {};
                }
            }
        }
        recurse(data, "");
        return result;
    }
}

//#endregion