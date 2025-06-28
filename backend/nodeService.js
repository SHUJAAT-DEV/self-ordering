const Service=require('node-windows').Service;

const svc=new Service({
    name:"NodeServerDistMain",
    description:"it will start nest project product display in background",
    //script:"H:\\product_display\\backend\\dist\\main.js"
    script:"E:\\LTS Works\\hotel-management-system\\backend\\dist\\main.js"
    
})


svc.on('install',function(){
    svc.start()
})

svc.install()