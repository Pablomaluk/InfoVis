const svg = d3.select("#vis_3").append("svg");
svg.attr("width", 970).attr("height", 527.5).style("border", "1px solid black");

d3.select("#league-filter").on("change", (event) => {
    createChart(event.target.value, document.getElementById("result-filter").value);
})

d3.select("#result-filter").on("change", (event) => {
    createChart(document.getElementById("league-filter").value, event.target.value);
})

function createChart(league, result) {
    svg.append("text")
        .attr("x", 200)
        .attr("y", 20)
        .text("Equipo")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .attr("text-anchor", "end");
    
    svg.append("line")
        .attr("id", 'grid_line')
        .attr("x1", 0)
        .attr("y1", 27.5)
        .attr("x2", 970)
        .attr("y2", 27.5)
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5);

    d3.csv("data/results.csv").then((data) => {
        console.log(data);

        svg.selectAll(".matchday")
        .data(data.slice(0, 39))
        .join(
            enter => {
                const G2 = enter.append("g")
                    .attr("id", (_, i) => `matchday_${i+1}`)
                    .attr("class", "matchday")

                    G2.append("line")
                    .attr("x1", (_, i) =>  i * 20 + 210)
                    .attr("y1", 0)
                    .attr("x2", (_, i) =>  i * 20 + 210)
                    .attr("y2", 527)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.5);
                    
                    G2.append("text")
                    .attr("x", (_, i) =>  i * 20 + 220)
                    .attr("y", 20)
                    .text((_, i) => {
                        if (i == 38){
                            return ""
                        }
                        else {
                            return `${i+1}`
                        }
                    })
                    .style("font-size", "10px")
                    .style("font-weight", "bold")
                    .attr("text-anchor", "middle");
            },
        )
            
        svg.selectAll(".team_group")
        .data(data.filter(d => d.league_name == league))
        .join(
            enter => {
                const G = enter.append("g")
                    .attr("id", (_, i) => `team_${i}`)
                    .attr("class", "team_group")
                    .attr("transform", (_, i) => `translate(0, ${(i+1) * 25})`)

                G.append("text")
                    .attr("id", (d) => `${d.team_name}_label`)
                    .attr("class", "team_label")
                    .attr("x", 200)
                    .attr("y", 20)
                    .text((d) => `${d.team_name}`)
                    .style("font-size", "15px")
                    .attr("text-anchor", "end");
                
                G.append("line")
                    .attr("id", (d) => `${d.team_name}_line`)
                    .attr("class", "team_line")
                    .attr("x1", 0)
                    .attr("y1", 27.5)
                    .attr("x2", 970)
                    .attr("y2",  27.5)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.5);
                
                G.selectAll(".team_group_rect")
                    .data(d => {
                        let a = [...Array(38).keys()].map(i => d[i+1]);
                        return a
                    })
                    .join(
                        enter => {
                            // console.log(enter);
                            let rects = enter.append("rect");

                            rects.attr("class", "team_group_rect")
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
                
                update.select(".team_line")
                    .attr("id", (d) => `${d.team_name}_line`)

                update.selectAll("team_group_rect")
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
                                
                            rects.attr("class", "team_group_rect")
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
    
createChart("Premier League", "Wins");