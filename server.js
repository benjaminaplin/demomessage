var net = require("net");
var fs = require("fs");
var port = 2000;
var vmArray = [];

var server = net.createServer(function(connection){
  connection.setEncoding("utf8");
  connection.write("hey welcome to ben's message barrel! write" + "\r\n" + " 'add' 'yourname' then the positive message!")
  connection.on('data', function(vmInput){
    vmInput = vmInput.trim();
    vmInput = vmInput.split(" ");
    message = vmInput.slice(2);

    message = message.join(" ");

    var Vm = function Vm(vmName, vmId, vmMessage){
      this.vmName =vmName;
      this.vmId = vmId;
      this.vmMessage = vmMessage
    } 

    var originalJSON = fs.readFileSync("vm.json", "utf8");
    var parsed = JSON.parse(originalJSON);

    var counter = 0;
    
    if(vmInput[0] === "add"){
        parsed.forEach(function(element){
            counter++;
        })
        newVm = new Vm (vmInput[1], counter, message)
        connection.write(newVm.vmName + "\'s message" + " added!");
        parsed.push(newVm);
        myJSON = JSON.stringify(parsed);
        fs.writeFileSync("vm.json", myJSON);
     } else if(vmInput[0] === "read" && vmInput[1] === "password"){
        parsed.forEach(function(element){
          connection.write(element.vmName + " left the following message: " + element.vmMessage + "\r\n");
        });
     } else if(vmInput[0] === "read" && vmInput[1] !== "password"){
        connection.write("please include password, or no messages for you!");
     } else if(vmInput[0] === "delete_all") {
        parsed = [];   
        connection.write("you just deleted all your messages!");
        myJSON = JSON.stringify(parsed);
        fs.writeFileSync("vm.json", myJSON);
     } else if(vmInput[0] === "delete"){
        for (var i = 0; i < parsed.length; i++){
          if(vmInput[1] == parsed[i].vmId){
            parsed.splice(i, 1);
            connection.write("you just deleted " + parsed[i].vmName + "\'s message!");
          }
        };     
        myJSON = JSON.stringify(parsed);
        fs.writeFileSync("vm.json", myJSON); 
     }
  }); 
});   


server.listen(port, function(){
  console.log("Server up and running, listening on " + port);
})