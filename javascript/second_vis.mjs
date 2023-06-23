const svg2 = d3.select("#vis_2").append("svg");
const WIDTH = 900;
const HEIGHT = 500;

svg2.attr("width", WIDTH).attr("height", HEIGHT);

d3.select("#team-filter-1").on("change", (_) => {
    createChart2(document.getElementById("league-filter").value, document.getElementById("matchday-filter").value);
})

d3.select("#team-filter-2").on("change", (_) => {
    createChart2(document.getElementById("league-filter").value, document.getElementById("matchday-filter").value);
})

d3.select("#matchday-filter").on("change", (event) => {
    createChart2(document.getElementById("league-filter").value, event.target.value);
})

let radialScale = d3.scaleLinear()
    .domain([0, 4])
    .range([0, 200]);

svg2.selectAll("grid_circle_group")
    .data([1, 2, 3, 4])
    .join(
        enter => {
            let group = enter.append("g")
                .attr("class", "grid_circle_group")

            group.append("circle")
                .attr("class", "grid_circle")
                .attr("cx", WIDTH / 2)
                .attr("cy", HEIGHT / 2)
                .attr("fill", "transparent")
                .attr("stroke", (_, i) => i == 3 ? "black" : "gray")
                .attr("r", d => radialScale(d))
        }
    );

svg2.selectAll(".grid_line")
    .data(["last5_fulltime_goals_for_mean", "last5_1sthalf_goals_for_mean", "last5_2ndhalf_goals_for_mean", "last5_fulltime_goals_against_mean", "last5_1sthalf_goals_against_mean", "last5_2ndhalf_goals_against_mean"])
    .join(
        enter => {
            // console.log("enter");
            let G2 = enter.append("g")
                .attr("id", (_, i) => `grid_line_${i}`)
                .attr("class", "grid_line")
            
            G2.append("line")
                .attr("id", (_, i) => `grid_line_${i}`)
                .attr("class", "grid_line")
                .attr("x1", WIDTH / 2)
                .attr("y1", HEIGHT / 2)
                .attr("x2", (_, i) => {
                    let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 200;
                    return WIDTH / 2 + x;
                }
                )
                .attr("y2", (_, i) => {
                    let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 200;
                    return HEIGHT / 2 - y;
                }
                )
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"))
            
            G2.append("text")
                .attr("id", (_, i) => `grid_text_${i}`)
                .attr("class", "grid_text")
                .attr("x", (_, i) => {
                    let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 215;
                    return WIDTH / 2 + x;
                }
                )
                .attr("y", (_, i) => {
                    let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 215;
                    return HEIGHT / 2 - y;
                }
                )
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "12px")
                .attr("fill", "gray")
                .attr("transform", (_, i) => {
                    let x = Math.cos(((i - 2.5) * -60) * (Math.PI / 180)) * 215;
                    let y = Math.sin(((i - 2.5) * -60) * (Math.PI / 180)) * 215;
                    return `rotate(${((i % 3) * 60) - 60}, ${WIDTH / 2 + x}, ${HEIGHT / 2 - y})`;
                }
                )
                .text(d => {
                    switch (d) {
                        case "last5_fulltime_goals_for_mean":
                            return "Tiempo Completo";
                        case "last5_1sthalf_goals_for_mean":
                            return "Primer Tiempo";
                        case "last5_2ndhalf_goals_for_mean":
                            return "Segundo Tiempo";
                        case "last5_fulltime_goals_against_mean":
                            return "Tiempo Completo";
                        case "last5_1sthalf_goals_against_mean":
                            return "Primer Tiempo";
                        case "last5_2ndhalf_goals_against_mean":
                            return "Segundo Tiempo";
                    }
                })
        }
    )

svg2.append("text")
    .attr("class", "grid_text")
    .attr("x", WIDTH / 2)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "gray")
    .attr("font-weight", "bold")
    .text("Promedio de goles anotados en los últimos 5 partidos")

svg2.append("text")
    .attr("class", "grid_text")
    .attr("x", WIDTH / 2)
    .attr("y", 490)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "gray")
    .attr("font-weight", "bold")
    .text("Promedio de goles recibidos en los últimos 5 partidos")

function createChart2(league, matchday){
    d3.csv("data/last5.csv").then((data) => {
        console.log(data.filter(d => d.league_name == league && d.matchday == matchday));

        let max_goals_for = d3.max(data.filter(d => d.league_name == league && d.matchday == matchday), d => d.last5_fulltime_goals_for_mean);
        let dataRadialScale1 = d3.scaleLinear()
            .domain([0, max_goals_for])
            .range([0, 200]);

        let max_goals_against = d3.max(data.filter(d => d.league_name == league && d.matchday == matchday), d => d.last5_fulltime_goals_against_mean);
        let dataRadialScale2 = d3.scaleLinear()
            .domain([0, max_goals_against])
            .range([0, 200]);

        let dropdown = d3.select("#team-filter-1")
        dropdown.selectAll("option").data(data.filter(d => d.league_name == league && d.matchday == matchday)).join(
            enter => {
                enter.append("option")
                    .text(function(d) {
                        return d.team;
                    })
                    .attr("value", function(d) {
                        return d.team;
                    });
            },
            update => {
                update,
                update.text(function(d) {
                    return d.team;
                })
                .attr("value", function(d) {
                    return d.team;
                });
            },
            exit => {
                exit.remove()
            });

        let dropdown2 = d3.select("#team-filter-2")
        dropdown2.selectAll("option").data(data.filter(d => d.league_name == league && d.matchday == matchday)).join(
            enter => {
                enter.append("option")
                    .text(function(d) {
                        return d.team;
                    })
                    .attr("value", function(d) {
                        return d.team;
                    });
            },
            update => {
                update,
                update.text(function(d) {
                    return d.team;
                })
                .attr("value", function(d) {
                    return d.team;
                });
            },
            exit => {
                exit.remove()
            });

        let dropdown3 = d3.select("#matchday-filter")
        dropdown3.selectAll("option").data(data.filter(d => d.league_name == league && d.team == d3.select("#team-filter-1").node().value)).join(
            enter => {
                enter.append("option")
                    .text(function(d) {
                        return d.matchday;
                    })
                    .attr("value", function(d) {
                        return d.matchday;
                    });
            },
            update => {
                update,
                update.text(function(d) {
                    return d.matchday;
                })
                .attr("value", function(d) {
                    return d.matchday;
                });
            },
            exit => {
                exit.remove()
            });

        svg2.selectAll(".team_group")
            .data(data.filter(d => (d.team == d3.select("#team-filter-1").node().value || d.team == d3.select("#team-filter-2").node().value) && d.matchday == matchday))
            .join(
                enter => {
                    // console.log("enter");
                    let G = enter.append("g")
                        .attr("id", (_, i) => `team_group_${i}`)
                        .attr("class", "team_group")

                    G.append("circle")
                        .attr("class", "team_circle_1")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                    
                    G.append("circle")
                        .attr("class", "team_circle_2")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                    
                    G.append("circle")
                        .attr("class", "team_circle_3")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")

                    G.append("circle")
                        .attr("class", "team_circle_4")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                    
                    G.append("circle")
                        .attr("class", "team_circle_5")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")

                    G.append("circle")
                        .attr("class", "team_circle_6")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                    
                    G.append("path")
                        .attr("class", "team_path")
                        .transition()
                        .duration(500)
                        .attr("d", d => {
                            let x1 = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            let y1 = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            let x2 = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            let y2 = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            let x3 = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            let y3 = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            let x4 = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            let y4 = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            let x5 = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            let y5 = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            let x6 = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            let y6 = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return `M ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1} L ${WIDTH / 2 + x2} ${HEIGHT / 2 - y2} L ${WIDTH / 2 + x3} ${HEIGHT / 2 - y3} L ${WIDTH / 2 + x4} ${HEIGHT / 2 - y4} L ${WIDTH / 2 + x5} ${HEIGHT / 2 - y5} L ${WIDTH / 2 + x6} ${HEIGHT / 2 - y6} L ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1}`;
                        }
                        )
                        .attr("stroke", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                        .attr("stroke-width", 1.5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                        .attr("fill-opacity", 0.2)

                    G.append("circle")
                        .attr("class", "legend_circle")
                        .transition()
                        .duration(500)
                        .attr("cx", 10)
                        .attr("cy", (_, i) => i == 0 ? 25 : 55)
                        .attr("r", 5)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")

                    G.append("text")
                        .attr("class", "team_text")
                        .transition()
                        .duration(500)
                        .attr("x", 20)
                        .attr("y", (_, i) => i == 0 ? 30 : 60)
                        .attr("text-anchor", "start")
                        .attr("font-size", 15)
                        .attr("font-weight", "bold")
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                        .text(d => d.team)

                    G.append("text")
                        .attr("class", "grid_label_1")
                        .attr("x", 438)
                        .attr("y", 60)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("fill", "gray")
                        .text(`${max_goals_for}`)

                    G.append("text")
                        .attr("class", "grid_label_2")
                        .attr("x", 454)
                        .attr("y", 444)
                        .attr("text-anchor", "start")
                        .attr("dominant-baseline", "middle")
                        .attr("font-size", "12px")
                        .attr("fill", "gray")
                        .text(`${max_goals_against}`)
                },
                update => {
                    // console.log(update);
                    update.select(".team_circle_1")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })
                    
                    update.select(".team_circle_2")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })

                    update.select(".team_circle_3")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            return HEIGHT / 2 - y;
                        })

                    update.select(".team_circle_4")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })
                    
                    update.select(".team_circle_5")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })

                    update.select(".team_circle_6")
                        .transition()
                        .duration(500)
                        .attr("cx", d => {
                            let x = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return WIDTH / 2 + x;
                        })
                        .attr("cy", d => {
                            let y = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return HEIGHT / 2 - y;
                        })
                    
                    update.select(".team_path")
                        .transition()
                        .duration(500)
                        .attr("d", d => {
                            let x1 = Math.cos((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            let y1 = Math.sin((150) * (Math.PI / 180)) * dataRadialScale1(d.last5_fulltime_goals_for_mean);
                            let x2 = Math.cos((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            let y2 = Math.sin((90) * (Math.PI / 180)) * dataRadialScale1(d.last5_1sthalf_goals_for_mean);
                            let x3 = Math.cos((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            let y3 = Math.sin((30) * (Math.PI / 180)) * dataRadialScale1(d.last5_2ndhalf_goals_for_mean);
                            let x4 = Math.cos((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            let y4 = Math.sin((-30) * (Math.PI / 180)) * dataRadialScale2(d.last5_fulltime_goals_against_mean);
                            let x5 = Math.cos((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            let y5 = Math.sin((-90) * (Math.PI / 180)) * dataRadialScale2(d.last5_1sthalf_goals_against_mean);
                            let x6 = Math.cos((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            let y6 = Math.sin((-150) * (Math.PI / 180)) * dataRadialScale2(d.last5_2ndhalf_goals_against_mean);
                            return `M ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1} L ${WIDTH / 2 + x2} ${HEIGHT / 2 - y2} L ${WIDTH / 2 + x3} ${HEIGHT / 2 - y3} L ${WIDTH / 2 + x4} ${HEIGHT / 2 - y4} L ${WIDTH / 2 + x5} ${HEIGHT / 2 - y5} L ${WIDTH / 2 + x6} ${HEIGHT / 2 - y6} L ${WIDTH / 2 + x1} ${HEIGHT / 2 - y1}`;
                        })
                        .attr("stroke", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                        .attr("stroke-width", 2)
                        .attr("fill", (_, i) => i == 0 ? "#79B4A9" : "#7765E3")
                        .attr("fill-opacity", 0.2)

                    update.select(".team_text")
                        .text(d => d.team)
                    
                    update.select(".grid_label_1")
                        .text(`${max_goals_for}`)

                    update.select(".grid_label_2")
                        .text(`${max_goals_against}`)
                },
                exit => {
                    exit.transition()
                        .duration(500)
                        .style("opacity", 0)
                        .remove()
                }
            );
    });
}

export { createChart2 };