// const tests = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
const tests=[]
var n = 12
for (var i = 0; i < 5; i++){
    tests.push([])
    for (var j = 0 ; j < n; j++){
        tests[i].push(Math.floor(Math.random()*7));
    }
}

module.exports = tests;