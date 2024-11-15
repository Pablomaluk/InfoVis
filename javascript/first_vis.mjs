// Javascript para la primera visualización

const width = 1200;
const height = 627.5;
const margin = 80;

function createChart1(){
    const svg_1 = d3.select("#vis_1").append("svg").attr("width", width).attr("height", height);

    updateChart1(
        svg_1,
        document.getElementById("league-filter").value, 
        document.getElementById("score-team-filter-vis-1").value,
        document.getElementById("score-time-filter-vis-1").value
    );

    return svg_1;
}


d3.select("#score-team-filter-vis-1").on("change", (event) => {
    let svg = d3.select("#vis_1").select("svg");
    updateChart1(svg,
        document.getElementById("league-filter").value, 
        event.target.value,
        document.getElementById("score-time-filter-vis-1").value);
});

d3.select("#score-time-filter-vis-1").on("change", (event) => {
    let svg = d3.select("#vis_1").select("svg");
    updateChart1(svg,
        document.getElementById("league-filter").value, 
        document.getElementById("score-team-filter-vis-1").value,
        event.target.value);
});


function updateChart1(svg, selectedLeague, selectedScorer, selectedGoalType) {

    svg.selectAll("g").remove();

    d3.csv("data/dataset.csv").then((data) => {

        let matchdayStatistics = getFilteredData(data, selectedLeague, selectedScorer, selectedGoalType);
    
        // create SVG
        const chartWidth = width - 2 * margin;
        const chartHeight = height - 2 * margin;
        
        let minMatchday = d3.min(matchdayStatistics, (d) => d.matchday);
        let maxMatchday = d3.max(matchdayStatistics, (d) => d.matchday);
        let maxGoals = d3.max(matchdayStatistics, (d) => d.max);
        let boxWidth = chartWidth/maxMatchday;
    
        // Create scales
        const xScale = d3.scaleLinear()
        .domain([1, maxMatchday])
        .range([0, chartWidth])
    
        const yScale = d3.scaleLinear()
        .domain([0, maxGoals])
        .range([chartHeight, 0]);
    
        const xAxis = d3.axisBottom(xScale)
            .tickValues(d3.range(Math.ceil(xScale.domain()[0]), Math.floor(xScale.domain()[1]) + 1));
        svg.append("g")
        .transition()
        .duration(500)
        .attr("transform", `translate(${margin + boxWidth}, ${height-margin})`)
        .call(xAxis)

        svg.append("g")
            .append("text")
            .transition()
            .duration(500)
            .attr("x", width/2.5)
            .attr("y", height - margin/4)
            .style("font-size", "18px")
            .style("fill", "black")
        .text("Fecha del campeonato (N° de partido)")

        const yAxis = d3.axisLeft(yScale);
        
        svg.append("g")
        .transition()
        .duration(500)
        .attr("transform", `translate(${margin}, ${margin/2})`)
        .call(yAxis);
        
        svg.append("g")
            .append("text")
            .transition()
            .duration(500)
            .attr("x", margin/2)
            .attr("y", margin/2 - 20)
            .style("font-size", "18px")
            .style("fill", "black")
            .text("Goles")

    
        const boxplotGroups = svg.selectAll(".g")
        .data(matchdayStatistics)
        .join(
            (enter) => enter.append("g")
            .attr("id", "boxplot")
            .attr("transform", (d) => `translate(${(margin + boxWidth + xScale(d.matchday))}, ${margin/2})`)
            .attr("fill", "transparent")
            .attr("stroke", "black"),
        );
    
        boxplotGroups.append("rect")
        .data(matchdayStatistics)
        .join("rect")
        .attr("x", -boxWidth/4)
        .attr("width", boxWidth/2)
        .transition()
        .duration(500)
        .attr("y", (d) => (yScale(d.q3)))
        .attr("height", (d) => (chartHeight - yScale(d.q3 - d.q1)));

    
        boxplotGroups.append("line")
        .data(matchdayStatistics)
        .join("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .transition()
        .duration(500)
        .attr("y1", (d) => (yScale(d.min)))
        .attr("y2", (d) => (yScale(d.q1)))
    
        boxplotGroups.append("line")
        .data(matchdayStatistics)
        .join("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .transition()
        .duration(500)
        .attr("y1", (d) => (yScale(d.q3)))
        .attr("y2", (d) => (yScale(d.max)))

        boxplotGroups.append("line")
        .data(matchdayStatistics)
        .join("line")
        .attr("x1", -boxWidth/4)
        .attr("x2", boxWidth/4)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .transition()
        .duration(500)
        .attr("y1", (d) => (yScale(d.q2)))
        .attr("y2", (d) => (yScale(d.q2)));

        svg.call(d3.brush().extent([[margin, margin], [width, height-margin]]).on("brush end", (event)=>{highlightRects(svg, event.selection, xScale, boxWidth)}));

        
    });

}

function highlightRects(svg, selection, xScale, boxWidth){
    let gs = svg.selectAll("#boxplot");
    if (selection != null) {
    gs.classed("selected", (g)=>{return isBrushed(g, selection, xScale, boxWidth)});
    gs.classed("notSelected", (g)=>{return !isBrushed(g, selection, xScale, boxWidth)});
    if (!svg.selectAll(".selected").size()){
        gs.classed("notSelected", false);
    }
    } else {
    gs.classed("selected", false);
    gs.classed("notSelected", false);
    }

}


function isBrushed(g, selection, xScale, boxWidth){
    let result = selection[0][0] <= boxWidth + margin + xScale(g.matchday) && selection[1][0] >= boxWidth + margin + xScale(g.matchday);
    return result
}

function getFilteredData(data, selectedLeague, selectedScorer, selectedGoalType){
    
    let filteredData = data.filter((d) => {
    if (selectedLeague !== "All") {
        return d.league_name === selectedLeague;
    }
    return true;
    }).map((d) => {
    let column = "";

    if (selectedScorer === "Home Team") {
        column = "home_";
    } else if (selectedScorer === "Away Team") {
        column = "away_";
    } else if (selectedScorer === "Both") {
        column = "sum_";
    }

    if (selectedGoalType === "First Half") {
        column += "1sthalf_goals";
    } else if (selectedGoalType === "Second Half") {
        column += "2ndhalf_goals";
    } else if (selectedGoalType === "Full Time") {
        column += "fulltime_goals";
    }

    return { matchday: d.matchday, goals: +d[column] };
    });

    const matchdayStatistics = Array.from(d3.rollup(filteredData, 
    (v) => ({
        min: +d3.min(v, (d) => d.goals),
        max: +d3.max(v, (d) => d.goals),
        q1: +d3.quantile(v.map((d) => d.goals).sort(d3.ascending), 0.25),
        q2: +d3.median(v, (d) => d.goals),
        q3: +d3.quantile(v.map((d) => d.goals).sort(d3.ascending), 0.75)
    }), 
    (d) => d.matchday
    )).map(([matchday, statistics]) => ({
    matchday: +matchday,
    ...statistics
    }));

    return matchdayStatistics;
};


export { createChart1, updateChart1 };