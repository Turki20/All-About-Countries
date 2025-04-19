let all_countries = []
let id = 0
pageination = document.querySelector('#pageination');
NumberOfPages = 0
currentPage = 0
con = document.querySelector('.content');
detail_id = 0;

async function get_all_countries() {
    all_countries = []
    id = 0
    const url = "https://restcountries.com/v3.1/all";
    document.querySelector('.loader').style.display = 'block';
    region = document.querySelector('#select').value;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        json.forEach(el => {
            if (el.region == region || region == 'all') {
                const lang = el.languages ? Object.values(el.languages)[0] : "N/A";
                const currencyKey = el.currencies ? Object.keys(el.currencies)[0] : null;
                const currency = currencyKey ? el.currencies[currencyKey].name : "N/A";
                const currencySymbol = currencyKey ? el.currencies[currencyKey].symbol : "N/A";

                const obj = {
                    id: id,
                    officialName: el.translations.ara?.official || "N/A",
                    language: lang,
                    region: el.region || "N/A",
                    continent: el.continents ? el.continents[0] : "N/A",
                    capital: el.capital ? el.capital[0] : "N/A",
                    flagSvgUrl: el.flags?.svg || "N/A",
                    currency: currency,
                    currencySymbol: currencySymbol,
                    drivingSide: el.car?.side || "N/A",
                    googleMaps: el.maps?.googleMaps || "N/A",
                    area: el.area || 0
                };
                id++;
                all_countries.push(obj)
            }
        });
        document.querySelector('.loader').style.display = 'none';
    } catch (error) {
        console.error(error.message);
    }
}

async function reset(){
    con.innerHTML = `<div class="loader" style="display: none;"></div>`;
    
    await get_all_countries()

    for (let i = 0; i < 20; i++) {
        con.innerHTML += `
                <div class="item">
                    <div class="img">
                        <img src="${all_countries[i].flagSvgUrl}" alt="">
                    </div>
                    <div class="item-body">
                        <h6>${all_countries[i].officialName}</h6>
                        <p>العاصمة: ${all_countries[i].capital}</p>
                        <p>اللغة: ${all_countries[i].language}</p>
                        <button name="id" onclick="clicked_detail(${all_countries[i].id})">المزيد من المعلومات</button>
                    </div>
                </div>
    `;
    }

    NumberOfPages = Math.trunc((all_countries.length / 20))
    currentPage = 0
    pageination.innerHTML = `
    <li>0</li>
    <li id="pageNumber">0</li>
    <li>${NumberOfPages}</li>
    `;
}

function reset_detail(){
    country = all_countries[detail_id]
    c = document.querySelector('.countainer');
    c.innerHTML =`
            <div id="s" onclick="closee()"><i class="fas fa-window-close"></i></div>
            <div class="img">
                <img src="${country.flagSvgUrl}" alt="">
            </div>
            <h1>${country.officialName}</h1>
            <div id="flex">
            <div>
            <p>العاصمة: ${country.capital}</p>
            <p>اللغة: ${country.language}</p>
            <p>القارة: ${country.continent}</p>
            <p>العملة: ${country.currency}</p>
            </div>
            <div>
            <p>رمز العملة: ${country.currencySymbol}</p>
            <p>جانب القيادة: ${country.drivingSide}</p>
            <p>المساحة: ${country.area}</p>
            </div>
            </div>
            
            <a href="${country.googleMaps}"  target="_blank" ><p>قوقل ماب</p></a>
           
    `
}
document.addEventListener("DOMContentLoaded", async () => {
    reset()
});

function clickRight() {
    if (currentPage == NumberOfPages) return
    currentPage++;
    document.querySelector('#pageNumber').innerHTML = currentPage
    newarr = []
    for (let i = currentPage * 20; i < currentPage * 20 + 20; i++) {
        if (i >= all_countries.length) break;
        newarr.push(all_countries[i]);
    }
    update_items(newarr)
}

function clickLeft() {
    if (currentPage == 0) return;
    currentPage--;
    document.querySelector('#pageNumber').innerHTML = currentPage;
    let newarr = [];
    for (let i = currentPage * 20; i < currentPage * 20 + 20; i++) {
        if (i >= all_countries.length) break;
        newarr.push(all_countries[i]);
    }
    update_items(newarr);
}

function update_items(items) {
    con.innerHTML = `<div class="loader" style="display: none;"></div>`;
    for (let i = 0; i < items.length; i++) {
        con.innerHTML += `
        <div class="item">
                    <div class="img">
                        <img src="${items[i].flagSvgUrl}" alt="">
                    </div>
                    <div class="item-body">
                        <h6>${items[i].officialName}</h6>
                        <p>العاصمة: ${items[i].capital}</p>
                        <p>اللغة: ${items[i].language}</p>
                        <button name="id" onclick="clicked_detail(${items[i].id})">المزيد من المعلومات</button>
                    </div>
                </div>`
    }
}

function search(){
    value = document.querySelector('#countryInput').value;
    newarr = []
    for(let i = 0; i < all_countries.length; i++){
        console.log(value + ' == ' + all_countries[i].officialName)
        if(all_countries[i].officialName.includes(value)){
            newarr.push(all_countries[i])
        }
    }
    update_items(newarr);
}

function clicked_detail(id){
    detail_id = id;
    console.log(id)
    reset_detail();
    document.querySelector('.countainer').style.display = 'block';
    document.querySelector('#main').style = 'filter: blur(4px);';
}

function closee(){
    console.log('click')
    document.querySelector('.countainer').style.display = 'none';
    document.querySelector('#main').style = 'filter: blur(0);';
}