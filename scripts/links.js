// csv military branch names
var arm = ["US Army","US Army (Retired)"];
var air = ["US Air Force","US Air Force (Retired)","US Air Force Reserves","US Air Force Reserves (Retired)"];
var nav = ["US Navy","US Navy (Retired)","US Naval Reserves","US Naval Reserves (Retired)"];
var mar = ["US Marine Corps","US Marine Corps (Retired)","US Marine Corps Reserves","US Marine Corps Reserves (Retired)"];
var coa = ["US Coast Guard","US Coast Guard (Retired)"];
// Purposefully placing marine first
var milBranch = [mar, arm, air, nav, coa];

// link names
var gen = ["Male", "Female"];
var school = ["Bachelors", "Graduate"];
// Purposefully placing Marine Corps first
var mil = ["Marine Corps", "Army", "Air Force", "Navy", "Coast Guard"];
var space = ["Space Flight", "Space Walk"];
var stat = ["Active", "Management", "Retired", "Deceased"];

function GetLinks(astros){
    unHighlight();
    console.log(astros[0])

    for(let i = 0; i < astros.length; i++)
    {
        let astro = astros[i];
        let astroLinks = [];

        if(astro["Gender"] != ""){
            let aGen = gen[0];
            if(astro["Gender"] == gen[1]){
                aGen = gen[1];
            }
            astroLinks.push(aGen)
        }

        if(astro["Undergraduate Major"] != ""){
            astroLinks.push(school[0])
        }

        if(astro["Graduate Major"] != ""){
            astroLinks.push(school[1])
        }

        if(astro["Military Branch"] != ""){
            // set marine
            let aMil = mil[0];
            let flag = 0;
            for(let i = 1; i < mil.length; i++){
                // check other branches - not marine
                for(let j = 1; j < milBranch[i].length; j++) {
                    if(astro["Military Branch"] == milBranch[i][j]){
                        aMil = mil[i];
                        flag = 1;
                    }
                    if(flag == 1) break;
                }
                if(flag == 1) break;
            }
            astroLinks.push(aMil)
        }

        if(astro["Space Flights"] > 0){
            astroLinks.push(space[0])

                if(astro["Space Walks"] > 0){
                astroLinks.push(space[1])
            }
        }

        if(astro["Status"] != ""){
            let aStat = stat[0];
            for(let i = 1; i < stat.length; i++){
                if(astro["Status"] == stat[i]){
                    aStat = stat[i];
                    break;
                }
            }
            astroLinks.push(aStat)
        }

        console.log(astroLinks)
        HighlightSankey(astroLinks);
    }
}

function HighlightSankey(links){
    let flag = 0;
    let last = 0;
	for(let i = 0; i < links.length; i++){

        if(flag == 1){
            highlight(links[last], links[i])
            flag = 0;
        }
        else{
            highlight(links[i], links[i+1])
        }

		if(links[i+1] == space[0]){
            last = i;
            flag = 1;
			i += 1;
			if(links[i+1] == space[1]){
				highlight(links[i], links[i+1])
				i += 1;
			}
		}
	}
}
