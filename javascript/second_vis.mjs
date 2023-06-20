const svg2 = d3.select("#vis_2").append("svg");
svg2.attr("width", 800).attr("height", 500).style("border", "1px solid black");

function createChart2(league, team_1, team_2){
    console.log(league, team_1, team_2);
}

export { createChart2 };