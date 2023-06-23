const svg = d3.select("#vis_3").append("svg");
svg.attr("width", 970).attr("height", 527.5).style("border", "1px solid black");


d3.select("#result-filter").on("change", (event) => {
    createChart3(document.getElementById("league-filter").value, event.target.value);
})

const x = d3.scaleLinear().domain([1, 39]).range([0, 760]);
const y = d3.scaleLinear().domain([0, 20]).range([500, 0]);
const xAxis = d3.axisBottom(x).ticks(38).tickSize(0);
const xAxisGrid = d3.axisBottom(x).tickSize(-527.5).tickFormat('').ticks(38);
const yAxisGrid = d3.axisLeft(y).tickSize(-970).tickFormat('').ticks(21);

svg.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(220, 7.5)")
    .call(xAxis).style("font-weight", "bold")
    .call(g => g.select(".domain").remove());

svg.append("g")
    .style("opacity", 0.5)
    .attr("id", "xAxisGrid")
    .attr("transform", "translate(210, 527.5)")
    .call(xAxisGrid)
    .call(g => {
        g.selectAll("line").style("opacity", 0.5)
    });

svg.append("g")
    .style("opacity", 0.5)
    .attr("id", "yAxisGrid")
    .attr("transform", "translate(0, 27.5)")
    .call(yAxisGrid)
    .call(g => {
        g.selectAll("line").style("opacity", 0.5)
    });

svg.append("text")
    .attr("x", 200)
    .attr("y", 17.5)
    .text("Equipo")
    .style("font-size", "15px")
    .style("font-weight", "bold")
    .attr("text-anchor", "end");


function createChart3(league, result) {

    d3.csv("data/results.csv").then((data) => {
        console.log(data);
            
        svg.selectAll(".result_group")
        .data(data.filter(d => d.league_name == league))
        .join(
            enter => {
                const G = enter.append("g")
                    .attr("id", (_, i) => `team_${i}`)
                    .attr("class", "result_group")
                    .attr("transform", (_, i) => `translate(0, ${(i+1) * 25})`)

                G.append("text")
                    .attr("id", (d) => `${d.team_name}_label`)
                    .attr("class", "team_label")
                    .attr("x", 200)
                    .attr("y", 20)
                    .text((d) => `${d.team_name}`)
                    .style("font-size", "15px")
                    .attr("text-anchor", "end");
                
                G.selectAll(".result_group_rect")
                    .data(d => {
                        let a = [...Array(38).keys()].map(i => d[i+1]);
                        return a
                    })
                    .join(
                        enter => {
                            // console.log(enter);
                            let rects = enter.append("rect");

                            rects.attr("class", "result_group_rect")
                                .attr("class", "result_rect")
                                .attr("x", (_, j) => 210 + 20 * (j))
                                .attr("y", 2.5)
                                .attr("width", 20)
                                .attr("height", 25)
                                .transition()
                                .duration(500)
                                .attr("fill", d => {
                                    if ((result == "Wins" || result == "All") && d == "W"){
                                        return "#248232"
                                    }
                                    else if ((result == "Draws" || result == "All")&& d == "D"){
                                        return "#6E8894"
                                    }
                                    else if ((result == "Losses" || result == "All")&& d == "L"){
                                        return "#CA566F"
                                    }
                                    else if (d == "P"){
                                        return "url(#diagonalHatch)"
                                    }
                                    return "transparent"
                                })
                                .attr("opacity", 0.5);
                            return rects
                        },
                    )
            },
            update => {
                // console.log()
                update.select(".team_label")
                    .attr("id", (d) => `${d.team_name}_label`)
                    .transition()
                    .duration(500)
                    .text((d) => `${d.team_name}`)

                update.selectAll("result_group_rect")
                    .data(d => {
                        let a = [...Array(38).keys()].map(i => d[i+1]);
                        return a
                    })
                    .join(
                        enter => {
                            enter.selectAll(".result_rect")
                                .transition()
                                .duration(200)
                                .style("opacity", 0)
                                .remove();
                            
                            let rects = enter.append("rect");
                                
                            rects.attr("class", "result_group_rect")
                                .attr("class", "result_rect")
                                .attr("x", (_, j) => 210 + 20 * (j))
                                .attr("y", 2.5)
                                .attr("width", 20)
                                .attr("height", 25)
                                .transition()
                                .duration(500)
                                .attr("fill", d => {
                                    if ((result == "Wins" || result == "All") && d == "W"){
                                        return "#248232"
                                    }
                                    else if ((result == "Draws" || result == "All") && d == "D"){
                                        return "#6E8894"
                                    }
                                    else if ((result == "Losses" || result == "All") && d == "L"){
                                        return "#CA566F"
                                    }
                                    else if (d == "P"){
                                        return "url(#diagonalHatch)"
                                    }
                                    return "transparent"
                                }
                                )
                                .attr("opacity", 0.5);
                            return rects
                        },
                    )
            },
            exit => {
                // console.log("exit")
                exit.transition()
                    .duration(200)
                    .style("opacity", 0)
                    .remove()
            }
        )
    });
}
    
export { createChart3 };