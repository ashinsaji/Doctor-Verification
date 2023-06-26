const doctorForm = document.querySelector('.doctor-verification-form')

doctorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = doctorForm.name.value;
    const regNo = doctorForm.regNo.value;
    const year = doctorForm.year.value;
    const smc = doctorForm.smc.value;


    const link = "https://www.nmc.org.in/MCIRest/open/getPaginatedData?service=getPaginatedDoctor&draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=500&search%5Bvalue%5D=&search%5Bregex%5D=false&";
    const s3 = "name=&registrationNo=09828&smcId=&year=&_=1687538772779"

    const finalLink = `${link}name=${Expression(name.toUpperCase())}&registrationNo=${Expression(regNo.toUpperCase())}&smcId=${smc}&_=1687538772779`

    fetch(finalLink, {
        method: 'GET',
        headers: {
            "Host": "www.nmc.org.in",
            "Sec-Ch-Ua-Platform": "Windows",
            "Sec-Fetch-Dest": "document",
        }
    })
    .then(response => {
        return response.json()
    })
    .then(res => {
        console.log(res.data[0])
        const docDetails1 = document.getElementById('details-1')
        docDetails1.innerHTML = res.data[0]
        if(res.data.length == 1) {
            const data = res.data[0][6].match(/'(.*?)'/g);
            const contents = data.map(match => match.slice(1, -1));
            console.log(contents)            
            getDoctorDetails({
                "doctorId": contents[0],
                "regdNoValue": contents[1]
            })
            .then(res => {
                console.log(res)
                const docDetails2 = document.getElementById('details-2')
                docDetails2.innerHTML = `${JSON.stringify({ "Address": res.address, "Parent Name": res.parentName, "University": res.university, "Year of Passing": res.yearOfPassing, "Date of Birth": res.birthDateStr })}`
            })
        }
    })
})

function Expression(name) {
    let s = ""
    for(let ch of name) {
        if((ch.charCodeAt(0) <= 57 && ch.charCodeAt(0) >= 48) || (ch.charCodeAt(0) <= 90 && ch.charCodeAt(0) >= 65)) {
            s += ch;
        } else {
            s += `%25${ch.charCodeAt(0).toString(16)}`
        }
    }
    return s;
}

function getDoctorDetails(docDetails) {
    return fetch("https://www.nmc.org.in/MCIRest/open/getDataFromService?service=getDoctorDetailsByIdImr", {
        method: 'POST',
        headers: {
            'Host': 'www.nmc.org.in',
            'Content-Type': 'application/json',            
            "Sec-Ch-Ua-Platform": "Windows",
            "Sec-Fetch-Dest": "document",
        },
        body: JSON.stringify(docDetails)
    })
    .then(response => {
        return response.json()
    })
    // .then(res => {
    //     console.log(res.address)
    // })
}

// [
//     1,
//     2023,
//     "APMC/FMR/112912",
//     "Andhra Pradesh Medical Council",
//     "SUDIGALA NATRAJ",
//     "S/O. SUDIGALA RAMANNA",
//     "<a href=\"javascript:void(0);\" onclick=\"openDoctorDetailsnew('12500177', 'APMC/FMR/112912')\">View</a>"
// ]