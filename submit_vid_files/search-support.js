document.addEventListener('DOMContentLoaded', function () {
    
    const vidderInpSubmit = Array.from(document.getElementsByName('vidders'));
    const userVidderInpSubmit = Array.from(document.getElementsByName('new_user_vidders'));
    const orphanVidderInpSubmit = document.getElementById('id_new_orphan_vidders');
    const searchData = document.getElementById('search-data');
    const addInputs = document.getElementById('add-inputs');
    
    let vidders = [];
    let mapping = {};
    let vidderInpSearch = [];

    async function writeViddersVal(e) {
        let currentVals = [];
        vidderInpSearch.forEach(input => {currentVals.push(input.value)});
        vidderInpSubmit.concat(userVidderInpSubmit).forEach(input => {input.value = ''});
        orphanVidderInpSubmit.value = '';
        currentVals.forEach(val => {
            if (!val) {
                sanitize ();
                return;
            } else {
                if (val in mapping) {
                    mapping[val][1].value = mapping[val][0].toString();
                } else {
                    orphanVidderInpSubmit.value = orphanVidderInpSubmit.value + val + ', ';
                }
            }
        });
        await sanitize ()
    }

    async function sanitize () {
        [vidderInpSubmit, userVidderInpSubmit].forEach(li => {li.forEach(inp => {
            if (!inp.value) {
                inp.setAttribute('form', "");
            } else {
                inp.removeAttribute('form');
            }
        })});
        orphanVidderInpSubmit.value = orphanVidderInpSubmit.value.replace(/,\s$/, "");
    }

    async function moreInputs (e) {
        const inputDiv = addInputs.parentElement;
        let count = vidderInpSearch.length;
        let iter = 0;
        const id_str = 'id_vidder_input_';
        while (iter < 4) {
            count++;
            const lbl = document.createElement('label');
            const inp = document.createElement('input');
            lbl.setAttribute('for', id_str + count.toString())
            lbl.innerText = 'Vidder ' + count.toString();
            inp.setAttribute('type', 'text');
            inp.setAttribute('form', '');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('id', id_str + count.toString());
            inputDiv.insertBefore(lbl, addInputs);
            inputDiv.insertBefore(inp, addInputs);
            inp.setAttribute('list', 'data-vidders');
            inp.addEventListener('blur', writeViddersVal);
            vidderInpSearch.push(inp);
            iter++;
        }
    }
    
    const getInputs = async (c = 1) => {
        let count = c;
        while (count < 1000) {
            el = document.getElementById('id_vidder_input_' + count.toString());
            if (el) {
                count++;
                vidderInpSearch.push(el);
            } else {
                break;
            }
        };
        vidderInpSearch.forEach(input => {
            input.addEventListener('blur', writeViddersVal);
        });
        addInputs.addEventListener('click', moreInputs);
    }

    const makeVidders = async () => {
        for(let inp of vidderInpSubmit.concat(userVidderInpSubmit)) {
            lbl = inp.getAttribute('label');
            vidders.push(lbl);
        };
        vidders = [... new Set(vidders)];
    }

    const parseInputs = async (arr) => {
        let inpObj = {}
        arr.forEach(inp => inpObj[inp.getAttribute('label')] = [inp.getAttribute('data-pk'), inp])
        return inpObj;
    }

    const stripDuplicates = async (v, u) => {
        for (let [k,e] of Object.entries(v)) {
            if (k in u) {
                delete u[k];
            }
        } return [v, u]
    }

    const makeMapping = async () => {
        let v = await parseInputs(vidderInpSubmit);
        let u = await parseInputs(userVidderInpSubmit);
        await stripDuplicates(v, u);
        mapping = Object.assign({}, v, u)
    }

    const makeDataList = async () => {
        await makeVidders();
        await getInputs();
        await makeMapping();
        datalist = document.createElement('datalist');
        datalist.setAttribute('id', 'data-vidders');
        vidders.forEach(vidder => {
            const opt = document.createElement('option');
            opt.setAttribute('value', vidder);
            datalist.appendChild(opt);
        });
        searchData.appendChild(datalist);
        vidderInpSearch.forEach(inp => {
            inp.setAttribute('list', 'data-vidders');
        });
    }
 
    makeDataList();

});