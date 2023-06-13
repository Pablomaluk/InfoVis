// Javascript para la tercera visualización

const svg = d3.select("#vis_3").append("svg");
svg.attr("width", 1000).attr("height", 800);

d3.csv("data/results.csv").then((data) => {
    console.log(data)
    console.log(data.filter(d => d.league_name == "Bundesliga"))

    svg.selectAll("lineas")
        .data(data)
        .join(
            enter => {
                enter.append("line")
                    .attr("x1", (_, i) =>  i * 20 + 210)
                    .attr("y1", 0)
                    .attr("x2", (_, i) =>  i * 20 + 210)
                    .attr("y2", 800)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.5);
            },
        )

    svg.selectAll("g")
        .data(data.filter(d => d.league_name == "Bundesliga"))
        .join(
            enter => {

            const G = enter.append("g")
                .attr("id", (d, i) => {
                    if (i != 0){
                        return `${d.team_name}`
                    }
                    else {
                        return "columns"
                    }
                })
                .attr("class", (d, i) => {
                    if (i != 0){
                        return "team_group"
                    }
                    else {
                        return "columns"
                    }
                })
            
            G.append("text")
                .attr("id", (d) => `${d.team_name}_label`)
                .attr("x", 200)
                .attr("y", (_, i) => {
                    if (i != 0){
                        return i * 25 + 20
                    }
                    else {
                        return 20
                    }
                })
                .text((d, i) => {
                    if (i != 0){
                        return `${d.team_name}`
                    }
                    else {
                        return "Equipos"
                    }
                })
                .style("font-size", (d, i) => {
                    if (i != 0){
                        return "15px"
                    }
                    else {
                        return "20px"
                    }
                })
                .style("font-weight", (d, i) => {
                    if (i != 0){
                        return "normal"
                    }
                    else {
                        return "bold"
                    }
                })
                .attr("text-anchor", "end");
            
            G.append("text")
                .attr("id", (d) => `${d.team_name}_label`)
                .attr("x", 200)
                .attr("y", (_, i) => {
                    if (i != 0){
                        return i * 25 + 20
                    }
                    else {
                        return 20
                    }
                })
                .text((d, i) => {
                    if (i != 0){
                        return `${d.team_name}`
                    }
                    else {
                        return "Equipos"
                    }
                })
                .style("font-size", (d, i) => {
                    if (i != 0){
                        return "15px"
                    }
                    else {
                        return "20px"
                    }
                })
                .style("font-weight", (d, i) => {
                    if (i != 0){
                        return "normal"
                    }
                    else {
                        return "bold"
                    }
                })
                .attr("text-anchor", "end");
            
            G.append("line")
                .attr("id", (d) => `${d.team_name}_line`)
                .attr("x1", 0)
                .attr("y1", (_, i) => {
                    if (i != 0){
                        return i * 25 + 27.5
                    }
                    else {
                        return 27.5
                    }
                })
                .attr("x2", 1000)
                .attr("y2", (_, i) => {
                    if (i != 0){
                        return i * 25 + 27.5
                    }
                    else {
                        return 27.5
                    }
                })
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("opacity", 0.5);

            },
            update => {
                console.log("update")
            },
            exit => {
                console.log("exit")
            }
        )
});
