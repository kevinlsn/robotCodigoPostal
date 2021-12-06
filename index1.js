const puppeteer = require('puppeteer');


( async ()  => {

    const fs = require('fs')
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()

    await page.goto('https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/Descarga.aspx');
    await page.screenshot({ path: 'codPostal1.jpg', fullPage: true });


    const jsonClaves = fs.readFileSync('codigoPostal.json','utf-8')
    //let guiasClaves = JSON.parse(jsonClaves)
    let guiasClaves = {};
    contador = 0;
    let estado = {}, municipio = {}


    try{
        
        // Estados

        let g = 21;
        await page.waitForSelector('select[id="DdlEstado"] option')
        const tiposData = await page.evaluate(() => Array.from(document.querySelectorAll('select[id="DdlEstado"] option'), element => [element.value, element.textContent]))
        console.log('Estados  ==============================  '+ tiposData[g][1].toString())
        await page.waitForTimeout(3000)
        estado = guiasClaves[tiposData[g][0]] !== undefined ? 
                        guiasClaves[tiposData[g][0]]:
                        {
                            claveEstado : tiposData[g][0],
                            nombreEstado : tiposData[g][1],
                            municipios : {}
                        }

        await page.select('select[id="DdlEstado"]', "21")
        await page.waitForTimeout(3000)

        // Municipio

        let m = 114;
        await page.waitForSelector('select[id="DdlMuni"] option')
        const divisionesData = await page.evaluate(() => Array.from(document.querySelectorAll('select[id="DdlMuni"] option'), element => [element.value, element.textContent]))
        console.log('Municipios  =============================  '+divisionesData[m][1].toString())
        await page.waitForTimeout(3000)
        municipio = estado.municipios[divisionesData[m][0]] !== undefined ?
                            estado.municipios[divisionesData[m][0]]:
                            {
                                claveMunicipio : divisionesData[m][0],
                                nombreMunicipio : divisionesData[m][1]
                                //codigoPostal :  
                                //asentamiento : 
                                //tipoAsentamiento : 
                            }

        await page.select('select[id="DdlMuni"]', "114")
        await page.screenshot({ path: 'codPostal2.jpg', fullPage: true });


        // Buscar

        await page.click("#btnFind")
        //await page.waitForSelector('#myTreen0Nodes')
        await page.waitForTimeout(4000)
        await page.screenshot({ path: 'codPostal3.jpg', fullPage: true });


        // Paginación (Cambio de página)

            // Evalúa las posibles páginas
        
            const enlaces = await page.evaluate(() => {
                //const elements = document.querySelectorAll('.dgotro > td > a')
                const elements = document.querySelectorAll('#dgCP > tbody > .dgotro > td > a')

                const links = [];
                    for(let element of elements) {
                        links.push(element.href);
                        }
                        return links;
    
            });

        
        // Objeto Primera Página

            var datos = {

                 codigoPostal: '#dgCP > tbody > .dgNormal', // sacar el innerHTML
                 // desglozar el innerHTML para obtener los datos del <td>

                 asentamiento: '#dgCP > tbody > .dgNormal',// sacar el innerHTML
                 // desglozar el innerHTML para obtener los datos del <td>

                 tipoAsentamiento: '#dgCP > tbody > .dgNormal',// sacar el innerHTML
                 // desglozar el innerHTML para obtener los datos del <td>

                 municipioo: '#dgCP > tbody > .dgNormal',// sacar el innerHTML
                 // desglozar el innerHTML para obtener los datos del <td>

                 estadoo: '#dgCP > tbody > .dgNormal'// sacar el innerHTML
                 // desglozar el innerHTML para obtener los datos del <td>

            }

            // Hace el cambio a las siguientes paginas

            const sigPag = [];
                for(let enlace of enlaces) {
                    await page.goto(enlace);
                    //await page.waitForSelector('.dgotro > td > a');
                    await page.waitForSelector('#dgCP > tbody > .dgotro > td > a');
                    await page.waitForTimeout(2000);
            
                }

            await page.screenshot({ path: 'codPostal4.jpg', fullPage: true });


        // Objeto segunda página
       
            var datos = {

                codigoPostal: '#dgCP > tbody > .dgNormal', .innerHTML
                // desglozar el innerHTML para obtener los datos del <td>
                asentamiento: '#dgCP > tbody > .dgNormal', .innerHTML
                tipoAsentamiento: '#dgCP > tbody > .dgNormal', .innerHTML
                municipioo: '#dgCP > tbody > .dgNormal', .innerHTML
                estadoo: '#dgCP > tbody > .dgNormal' .innerHTML

            }
    
    }finally{
        const jsonclaves = JSON.stringify(guiasClaves)
        fs.writeFileSync('codigoPostal.json',jsonclaves,'utf-8')
        await browser.close()
        
    }
    


}) ();