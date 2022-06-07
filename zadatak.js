class TableTemplates{
     //method to get the element
     getElement=selector => document.querySelector(selector) || document.getElementById(selector);

    renderHeader() {
        return `<table>
                <tr class="header"><th name="tableHeader" id="table-header-first-element"><div><span id="header-text-element"><input type="checkbox"> WEBSITE</span></div><div><img src="ic-drop-arrow-down.svg" /></div></th>
                    <th name="tableHeader" id="table-header-second-element"><div>SECTIONS</div></th><th name="tableHeader" id="table-header-third-element"><div>STATUS</div><div><img src="ic-expand-all.svg" id="expand-button"/></div></th>
                </tr>`;
    }

    renderOrganisationRow(organisation,i) {
        return ` <tr class="organisation-row" data-id=${i}> <td><img src="ic-arrow-right.svg"  class="pointer"/> ${organisation.name}</td></tr>`
    }

    renderSiteRows(sites, i) {
        return `<tr class="site-row" data-class="${i}">
                    <td id="site-data-first-element"> <input type="checkbox" class="pointer" name="site-checkbox"> <img src="ic-arrow-right.svg" /> <img src="image 4.svg" /><span class="site-row-name"> ${sites.name}</span> </td >
                    <td id="site-data-second-element"> ${sites.siteSections.length} </td >
                    <td id="site-data-third-element"> ${this.isSiteOperational(sites.isPrivate)} </td>
                </tr>
                </tr>
                `
          
    }
    isSiteOperational(operational) {
        return (operational ? ' <span data-title="Operational"><img src="ic_status_active.svg" class="no-pointer"/></span> Operational ' : '<span data-title="Offline"><img src="ic_status_nActive.svg" class="no-pointer"/></span> Offline');
    }

    renderSectionRow(i) {
        return `<tr class="pre-section-rowHeader" data-presec="${i}" name="section-row-header"><td> website section<td></tr> <tr class="section-row" data-sec=${i} name="section-row"> `;
    }

    renderSectionData(section) {
        return `<td class="section-data" name="secD"><input type="checkbox"> <span>${section.name}</span><span class="section-side-element"><div>${this.isSectionOperational(section.isPrivate)} </div> 
                   <div class="dropdown">${this.dropDownMenu()}</div></span></td>`
    
    }

    isSectionOperational(operational) {
        return (operational ? '<span data-title="Operational"><img src="ic_status_active.svg" class="no-pointer"/></span>' : '<span data-title="Offline"><img src="ic_status_nActive.svg"class="no-pointer" class="red"/></span>');
    }

    dropDownMenu(){
        return `<img src="ic-more@2x.svg" class="dropbtn"></img>
                <div class="dropdown-content"> 
                    <a href="#">GENERATE TAGS AS</a><a href="#">Numeric ID</a> <a href="#">Amp Code</a> <a href="#">String Code</a>
                </div>`
    }

    paginationElements(start, end, organisationLength) {
        return ` <div class="page-numbers">
                        <span>Show rows:</span>
                        <select id="list-elements">
                        <option  value="12" > 12 </option> <option value="24"> 24 </option> <option value="50"> 50 </option> 
                        </select> 
                    <span id="site-number">${start} - ${end} of ${organisationLength} </span><img src="ic_page_left.svg" id="left-button"/> <img src="ic_page_right.svg" id="right-button"/>
                 </div>                    `
    }
}


class Table extends TableTemplates{   
    constructor(container, data){
        super();
        this.tableContainer = this.getElement(container);
        this.data = data;
        this.selectRows();
    }
 

    renderTable(start, end, rows){

        this.tableContainer.innerHTML = "";
        let organisationLength = data.result.length;//količina svih organizacija//advertisers, publishers...

        let table = this.renderHeader()

        for(let i = start; i < end; i++){
            table += this.renderOrganisationRow(data.result[i],i);
            for (let j = 0; j < data.result[i].sites.length; j++) {
                table += this.renderSiteRows(data.result[i].sites[j], i) + this.renderSectionRow(i);
                for (let k = 0; k < data.result[i].sites[j].siteSections.length; k++) {
                    table += this.renderSectionData(data.result[i].sites[j].siteSections[k]);
                }
            }
        }
        
        let fakeStartPagination = 1;
        fakeStartPagination += start;

        this.tableContainer.innerHTML += table += `</table > `+ this.paginationElements(fakeStartPagination, end, organisationLength);

        const leftButton=document.getElementById("left-button");
        const rightButton=document.getElementById("right-button");
        this.listElements=document.getElementById('list-elements');

        if(end != this.listElements.value){//select 
            if(rows == 24) this.listElements[1].selected=true;
            else if(rows == 50) this.listElements[2].selected=true;
        }

        this.listElements.addEventListener('change', () => this.selectRows(start));
 
        if(start == 0) leftButton.style.pointerEvents='none';

        leftButton.addEventListener('click', () => this.changePageLeft(start, end));

        if(end == 50) rightButton.style.pointerEvents='none';  

        rightButton.addEventListener('click', () => this.changePageRight(start, end));

        const organisationRow = document.querySelectorAll('[data-id]');
        const siteRow = document.querySelectorAll('[data-class]');//presec i sec row
        const preSectionRow = document.querySelectorAll('[data-presec]');//website section row
        const sectionRow = document.querySelectorAll('[data-sec]');

        const tableHeaderElement = Array.from(document.getElementsByName("tableHeader"));
        const checkboxSite = Array.from(document.getElementsByName("site-checkbox"));
        
        const dropDownButton = document.querySelectorAll(".dropbtn");
        const dropDownContainer = document.querySelectorAll(".dropdown");
        
  
        
        const expandAllButton = document.getElementById("expand-button");
        let clickedOnExpandAll = 1;//on LOAD clicked once
        
        organisationRow.forEach((element, index, array) => {
            hideAllRows(element);            
            element.addEventListener("click", () => organisationRowClicked(element, index));
            expandAllButton.addEventListener("click", () => expandAllRows(index, array, element));
        });
       
        function organisationRowClicked(element,index) {
            organisationRow[index].classList.toggle("change-arrow");
            for (let i = 0; i < siteRow.length; i++) {
                if (element.dataset.id == siteRow[i].dataset.class) {  
                    siteRow[i].classList.toggle("show-row");
                if(preSectionRow[i].classList.contains("show-row") == false){
                    showHideSectionAll(i)
                    }
                }
            }
        }
        function hideAllRows(element) {
            for (let i = 0; i < siteRow.length; i++) {
                if (element.dataset.id == siteRow[i].dataset.class) {
                    siteRow[i].classList.toggle("show-row");
                    preSectionRow[i].classList.toggle("show-row");
                    sectionRow[i].classList.toggle("show-row");
                }
            }
        }
        
        function expandAllRows(index, array, element) {
            expandRowChangeArrow(index);
            for (let i = index; i < siteRow.length; i++) {
                expandRow(element, i, start + index);
            }
            if (index === array.length - 1) {
                clickedOnExpandAll ++;
            }
        }

       siteRow.forEach((element, index) => {
            element.addEventListener('click', (e) => {//e.stopPropagation
                if(e.target != checkboxSite[index]){
                    siteRow[index].classList.toggle("change-arrow");
                    preSectionRow[index].classList.toggle("show-row");
                    sectionRow [index].classList.toggle("show-row");  
                }
            })
        });
      
        function expandRowChangeArrow(index) {
            if (clickedOnExpandAll % 2 != 0 && organisationRow[index].classList.contains("change-arrow") == false) {
                organisationRow[index].classList.toggle("change-arrow");
            }
            else if (clickedOnExpandAll % 2 == 0 && organisationRow[index].classList.contains("change-arrow") == true) {
                organisationRow[index].classList.toggle("change-arrow");
            }
        }
        
        function expandRow(element, i, index) {
            if (index == siteRow[i].dataset.class) {
                const preSectionRowContains = preSectionRow[i].classList.contains("show-row");
                if (clickedOnExpandAll % 2 == 0 && siteRow[i].classList.contains("show-row") == false) {
                    siteOrgRowAll(i, index);
                    if (preSectionRowContains == false) {
                        showHideSectionAll(i);
                    }
                }
                else if (clickedOnExpandAll % 2 != 0 && siteRow[i].classList.contains("show-row") == true) {
                siteOrgRowAll(i, index);
                    if (preSectionRowContains == true) {
                        showHideSectionAll(i);
                    }
                }
                else if (clickedOnExpandAll % 2 == 0 && preSectionRowContains == false) {
                    showHideSectionAll(i);
                }
                else if (clickedOnExpandAll % 2 != 0 && preSectionRowContains == true) {
                    showHideSectionAll(i);
                }
            }
        }
        
        function siteOrgRowAll(i) {
            siteRow[i].classList.toggle("show-row");
        }
        
        function showHideSectionAll(i) {
            preSectionRow[i].classList.toggle("show-row");
            sectionRow[i].classList.toggle("show-row");
            siteRow[i].classList.toggle("change-arrow");
        }
        
        dropDownButton.forEach((element,index) => {
            element.addEventListener("click", function(){
                dropDownContainer[index].classList.toggle('show-menu');
            });
        });
        
        tableHeaderElement.forEach((element, index) => {
            element.addEventListener("click", () => {
                for(let i = 0; i < tableHeaderElement.length; i++){
                    if(index == i){
                        tableHeaderElement[index].className="onclick-change-header-color";
                    }
                    else{
                        tableHeaderElement[i].className="onclick-change-header-color-back";
                    }
                }
            })
        });  
    }

    selectRows(currentRows){
        this.list = document.querySelector("select");

        const currentPage = 0;
        currentRows;

        if(typeof currentRows !== 'undefined') currentRows = Number(this.list.value);
        else currentRows = 12;

        let start = currentRows * currentPage;
        let  end = start + currentRows;
        
        this.renderTable(start, end, currentRows);
    }

    changePageLeft(start, end){
        this.list = document.querySelector("select");
        let currentRows = Number(this.list.value);
        
        if(end == 50) end = 48;
        else end-= currentRows;

        start -=currentRows; 
     
        this.renderTable(start, end, currentRows)
    }
   
    changePageRight(start, end){
        this.list = document.querySelector("select");
        let currentRows = Number(this.list.value);
        start += currentRows;
        end += currentRows;
        
        if(end >= 51) end = 50;
        this.renderTable(start, end, currentRows);
    }
}


const table=new Table(".container", data)
