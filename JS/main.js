
const icons = [
    "SVG/Chat_Icon.png",
    "SVG/Email_Icon.png"
]

async function onStartUp() {

    var reader = new FileReader();

    
    
    
    //var myObj = JSON.parse();

    const id = "697eae2f-40dd-445e-a0f0-a918f3a4d5c0";
    console.log(Node.getParentNode(data, id));

    //using id again to insert into the child of a child
    Node.insertIntoData(data, id);
    
    // these should be objects 
    const preI0 = "Meeting at 10.20"
    Node.GetDomElement(preI0, icons[0]);
    
    const preI = "SYS:Urgent"
    Node.GetDomElement(preI, icons[1]);

    const preI1 = "Meeting at 13.20"
    Node.GetDomElement(preI1, icons[0]);
    
    const preI2 = "PAR:Arrange a meeting ASAP"
    Node.GetDomElement(preI2, icons[0]);
    
    const preI3 = "ACT:Arrange a meeting ASAP"
    Node.GetDomElement(preI3, icons[1]);
}

class Node {
    static GetDomElement(str, icon) {
        const mainTable = document.getElementById("main-table");
        var pre = null;

        // list of given prefixes
        var prefixes = ["SYS", "PAR", "ACT"];
        // returns the prefixe if there is one, or returns null
        // also the messages string without the prefix
        var getMessage = (s) => {
            var check = s.slice(0, 3);
            if (prefixes.includes(check)) {
                pre = check;
                return s.slice(4);
            } else {
                return s;
            }
        }

        var newElem = (msg) => {
            var li = document.createElement('li');

            li.setAttribute('class', 'table-element');

            li.classList.add(pre);

            li.innerHTML =
                `<div class="elem1"></div>
                <div class="elem2">04.12.2019 <span>13:41</span></div>
                <div class="elem3">
                    <small>Subject:</small>
                    <span>${msg}</span>
                </div>
                <div class="elem4">
                    John Doe <small>John.j.doe@lorem.co.uk</small>
                    <!-- <div class="elem4-child">hello</div> -->
                </div>
                <div class="elem5">
                    2 <span>Attachments</span>
                </div>
                <div class="elem6">
                    <img src=${icon} alt="Email_Icon">
                </div>`;

            
            return li;
        }

        const message = getMessage(str);
        const add = newElem(message);

        // should do this as a return and append all at the same time
        mainTable.appendChild(add);
    }

    static insertIntoData(data, str) {
        var result = null;
        var newNode = {
            id: 'hello'
        };

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

        if (result.children != null) {
            result.children.push(newNode);
        } else {
            result.children = [];
            result.children.push(newNode);
        }
        console.log(result);
    }

    // Tree Traversal, 
    static getParentNode(data, str) {
        var result = null;
        data.forEach(parent => {
            if (parent.children != null) {
                var child = parent.children;
                child.forEach(c => {
                    if (c.id === str) {
                        result = parent;
                    }
                });
                //console.log(child);
            }
        });
        return result;
    }

    // Tree Traversal, flatten data. usees recursion to itterate through
    // the data on the mulitiple levels of the JSON file.
    static flattenArray(data) {
        var result = [];
        var recurse = (cur, prop) => {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++) {
                    recurse(cur[i], prop ? prop + "." + i : "" + i);
                }
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