const svg = d3.select("#vis_3").append("svg");
svg.attr("width", 970).attr("height", 527.5).style("border", "1px solid black");

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

d3.select("#league-filter").on("change", (event) => {
    createChart(event.target.value);
})

function createChart(league) {
    d3.csv("data/results.csv").then((data) => {
        console.log(data);
        let new_data = d3.cross(data.filter(data => data.league_name == league), data.filter(data => data.league_name == league));

        svg.selectAll(".matchday")
        .data(data.slice(0, 39))
        .join(
                enter => {
                    const G2 = enter.append("g")
                        .attr("id", (_, i) => `matchday_${i+1}`)
                        .attr("class", (d) => "matchday")

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
                .attr("id", (d) => `${d.team_name}`)
                .attr("class", "team_group")

            G.append("text")
                .attr("id", (d) => `${d.team_name}_label`)
                .attr("class", "team_label")
                .attr("x", 200)
                .attr("y", (_, i) => (i + 1) * 25 + 20)
                .text((d) => `${d.team_name}`)
                .style("font-size", "15px")
                .attr("text-anchor", "end");
            
            G.append("line")
                .attr("id", (d) => `${d.team_name}_line`)
                .attr("class", "team_line")
                .attr("x1", 0)
                .attr("y1", (_, i) => (i + 1) * 25 + 27.5)
                .attr("x2", 970)
                .attr("y2", (_, i) => (i + 1) * 25 + 27.5)
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("opacity", 0.5);
            
            for (let j = 1; j <= 38; j++){
                G.append('rect')
                    .attr("id", (d) => `${d.team_name}_rect_${j}`)
                    .attr("class", `team_rect_${j}`)
                    .attr("x", 210 + 20 * (j - 1))
                    .attr("y", (_,i) => (i) * 25 + 27.5)
                    .attr("width", 20)
                    .attr("height", 25)
                    .attr("fill", (d) => {
                        if (d[j] == "W" && d[j + 1] == "W" || d[j] == "W" && d[j - 1] == "W"){
                            return "green"
                        }
                        return "transparent"
                    })
                    .transition()
                    .duration(500)
                    .attr("opacity", 0.5);
                    
                // G.append("text")
                //     .attr("id", (d) => `${d.team_name}_result_${j}`)
                //     .attr("class", `team_result_${j}`)
                //     .attr("x", 220 + 20 * (j - 1))
                //     .attr("y", (_, i) => (i + 1) * 25 + 20)
                //     .text((d) => {
                //             if (d[j] == 'P'){
                //             return ' '
                //         }
                //         else {
                //             return d[j]
                //         }
                //     })
                //     .style("font-size", "15px")
                //     .attr("text-anchor", "middle");
            }

        },
        update => {
            // console.log()
            update.select(".team_label")
                .transition()
                .duration(500)
                .text((d) => `${d.team_name}`)
            
            update.select(".team_line")
                .attr("id", (d) => `${d.team_name}_line`)

            for (let j = 1; j <= 38; j++){
                update.select(`.team_rect_${j}`)
                    .transition()
                    .duration(500)
                    .attr("id", (d) => `${d.team_name}_rect_${j}`)
                    .attr("fill", (d) => {
                        if (d[j] == "W" && d[j + 1] == "W" || d[j] == "W" && d[j - 1] == "W"){
                            return "green"
                        }
                        return "transparent"
                    })
                    .attr("opacity", 0.5);
                
                // update.select(`.team_result_${j}`)
                //     .transition()
                //     .duration(500)
                //     .attr("id", (d) => `${d.team_name}_result_${j}`)
                //     .text((d) => {
                //         if (d[j] == 'P'){
                //             return ' '
                //         }
                //         else {
                //             return d[j]
                //         }
                //     })
            }


        },
        exit => {
            // console.log("exit")
            exit
                .transition()
                .duration(500)
                .style("opacity", 0)
                .remove()
            }
        )
        });
    }
    
    createChart("Premier League");