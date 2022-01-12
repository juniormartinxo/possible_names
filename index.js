const csv = require('csv-parser');
const fs = require('fs');
const utf8 = require('utf8')
var slug = require('slug')
const results = [];
const file = './possible_names.csv'

fs.createReadStream('alunos.csv')
    .pipe(csv({separator:';'}))
    .on('data', (data) => results.push(data))
    .on('end', (path, callback) => {

        const possibleNames = results.map(item=>{
            return possibleName(item)
        })

        if (fs.existsSync(file)) {
            fs.unlink(file, err=>err)
        }

        const titleFields = 'Matrícula;Nome completo;Turma;Origem;Nome simples;Nome composto 01;Nome composto 02;Nome composto 03;Nome composto 04;Nome composto 05\n'


        fs.appendFile(file,titleFields, {encoding: 'utf-8'}, ()=>{
            possibleNames.map(names=>{
                const arrNames = Object.values(names)
    
                fs.appendFile(file, arrNames.join(';') + "\n", err=>err)
            })

        })

        
    });

function splitName(name){
    return name
        .trim()
        .replace(/\sDE\s|\sDO\s|\sDOS\s|\sDA\s/," ")
        .replace(/\s\s/,"")
        .split(" ")
}

function possibleName(itemName){
    const objName = splitName(itemName.nome)

   const lengthName = objName.length

    const names = {}
    names[0] = itemName.matricula
    names[1] = itemName.nome
    names[2] = itemName.turma
    names[3] = itemName.origem
    names[4] = objName[0]

    let n=5

    for(let i=1; i<lengthName; i++){
        names[n] = objName[0] + " " + objName[i]

        n++
    }

    //console.log(name)

    return names
}